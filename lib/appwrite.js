import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.scorpio.travels",
  projectId: "6677e2c5001318d52541",
  storageId: "667724800008a8b9c306",
  databaseId: "6677e4a9001d117ed523",
  userCollectionId: "6677e4c4000c2073177b",

};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// Register user
export async function createUser(email, password, username) {
  if (!email || !password || !username) {
    throw new Error('Missing required parameters: email, password, or username');
  }

  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw new Error('Account creation failed');

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error(error.message);
  }
}

// Sign In
export async function signIn(email, password) {
  if (!email || !password) {
    throw new Error('Missing required parameters: email or password');
  }

  try {
    const session = await account.createEmailSession(email, password);
    return session;
  } catch (error) {
    console.error('Error signing in:', error);
    throw new Error(error.message);
  }
}
// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw new Error('No current account found');

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw new Error('No user found');

    return currentUser.documents[0];
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Sign Out
export async function signOut() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.error('Error signing out:', error);
    throw new Error(error.message);
  }
}

// Upload File
export async function uploadFile(file, type) {
  if (!file || !type) {
    throw new Error('Missing required parameters: file or type');
  }

  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };

  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error(error.message);
  }
}

// Get File Preview
export async function getFilePreview(fileId, type) {
  if (!fileId || !type) {
    throw new Error('Missing required parameters: fileId or type');
  }

  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw new Error('Failed to get file URL');

    return fileUrl;
  } catch (error) {
    console.error('Error getting file preview:', error);
    throw new Error(error.message);
  }
}