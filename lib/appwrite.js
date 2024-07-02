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
  bookingCollectionId:'6679c2b0002ac9cceb43',
  driverDetailsCollectionId:'6679c3f9000025c458ec',

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
// Get Booking Details to create history and status
export async function getBookingDetails() {
  try {
    const bookingDetails = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.bookingCollectionId
    );

    if (!bookingDetails) throw new Error('No booking details found');

    return bookingDetails.documents;
  } catch (error) {
    console.error('Error getting booking details:', error);
    throw new Error(error.message);
  }
}
// Create Booking by user
export async function createBooking(bookingDetails) {
  if (!bookingDetails || !bookingDetails.Driver || !bookingDetails.time || !bookingDetails.destination || !bookingDetails.paymentDetails) {
    throw new Error('Missing required parameters');
  }

  try {
    const newBooking = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.bookingCollectionId,
      ID.unique(),
      {
        Driver: bookingDetails.Driver,
        time: bookingDetails.time,
        destination: bookingDetails.destination,
        paymentDetails: bookingDetails.paymentDetails,
      }
    );

    return newBooking;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw new Error(error.message);
  }
}
//Fetch Driver Details From DB
export async function fetchDriverDetails(){
  try {
    const driverDetails= await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.driverDetailsCollectionId
    );

    if (!driverDetails) throw new Error('No driver details found');

    return driverDetails.documents;
  } catch (error) {
    console.error('Error getting Driver details:', error);
    throw new Error(error.message);
  }
}
//save mpesa payment details to DB
export async function createPaymentDetails(){

}
// Clear booking history
export async function clearBookingHistory() {
  try {
    const bookings = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.bookingCollectionId
    );

    if (bookings.documents.length === 0) {
      console.log('No booking history to clear.');
      return;
    }

    for (const booking of bookings.documents) {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.bookingCollectionId,
        booking.$id
      );
    }

    console.log('Booking history cleared successfully.');
  } catch (error) {
    console.error('Error clearing booking history:', error);
    throw new Error(error.message);
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


