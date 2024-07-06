import {
  Account,
  Avatars,
  Client,
  Databases,
  Functions,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";
import { Alert } from "react-native";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.scorpio.travels",
  projectId: "6677e2c5001318d52541",
  storageId: "667724800008a8b9c306",
  databaseId: "6677e4a9001d117ed523",
  userCollectionId: "6683fb61000deda8c466",
  bookingCollectionId: "6679c2b0002ac9cceb43",
  driverDetailsCollectionId: "6679c3f9000025c458ec",
  DriverUserCollectionId: "668585700035cd53cd16",
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
const functions = new Functions(client);

// Register user
export async function createUser(email, password, username) {
  if (!email || !password || !username) {
    throw new Error(
      "Missing required parameters: email, password, or username"
    );
  }

  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw new Error("Account creation failed");

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
    console.error("Error creating user:", error);
    throw new Error(error.message);
  }
}
// Update User Profile
export async function updateUser(phone, accountId, username, email) {
  if (!(phone.startsWith("2547") && phone.length === 12)) {
    Alert.alert(
      "Invalid Phone Number",
      "Please enter a valid phone number in 254.. Convention."
    );
    return;
  } else {
    Alert.alert("Success", "User Updated Successfully");
  }

  try {
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      accountId,
      {
        phone: phone,
        username: username,
        email: email,
      }
    );

    return updatedUser;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new Error(error.message);
  }
}

// Sign In
export async function signIn(email, password) {
  if (!email || !password) {
    throw new Error("Missing required parameters: email or password");
  }

  try {
    const session = await account.createEmailSession(email, password);
    return session;
  } catch (error) {
    console.error("Error signing in:", error);
    throw new Error(error.message);
  }
}
// Get Current User
export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw new Error("No current account found");

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    // if (!currentUser) throw new Error("No user found");

    return currentUser.documents[0];
  } catch (error) {
    console.error("Error getting current user:", error);
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

    if (!bookingDetails) throw new Error("No booking details found");

    return bookingDetails.documents;
  } catch (error) {
    console.error("Error getting booking details:", error);
    throw new Error(error.message);
  }
}
// Create Booking by user
export const createBooking = async (bookingDetails) => {
  if (
    !bookingDetails ||
    !bookingDetails.clientName ||
    !bookingDetails.userId ||
    !bookingDetails.Driver ||
    !bookingDetails.time ||
    !bookingDetails.destination ||
    !bookingDetails.origin ||
    !bookingDetails.paymentDetails
  ) {
    throw new Error("Missing required parameters");
  }

  try {
    const newBooking = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.bookingCollectionId,
      ID.unique(),
      {
        origin: bookingDetails.origin,
        clientName: bookingDetails.clientName,
        userId: bookingDetails.userId,
        Driver: bookingDetails.Driver,
        time: bookingDetails.time,
        destination: bookingDetails.destination,
        paymentDetails: bookingDetails.paymentDetails,
        status: "Pending Review",
      }
    );

    return newBooking;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw new Error(error.message);
  }
};
//Fetch Driver Details From DB
export async function fetchDriverDetails() {
  try {
    const driverDetails = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.DriverUserCollectionId
    );

    if (!driverDetails) throw new Error("No driver details found");

    return driverDetails.documents;
  } catch (error) {
    console.error("Error getting Driver details:", error);
    throw new Error(error.message);
  }
}
//fetch corresponding driver details to be viewed by the user
export async function fetchCorrDriverDetails(username) {
  try {
    const driverDetails = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.DriverUserCollectionId,
      [Query.equal("username", username)] // Query by Username
    );

    if (
      !driverDetails ||
      !driverDetails.documents ||
      driverDetails.documents.length === 0
    ) {
      throw new Error("No driver details found");
    }

    return driverDetails.documents[0]; // Assuming username is unique, return the first document
  } catch (error) {
    console.error("Error getting driver details:", error);
    throw new Error(error.message); // Propagate the error for handling in your component
  }
}
//save mpesa payment details to DB
export async function createPaymentDetails() {}
// Clear booking history
export async function clearBookingHistory() {
  try {
    const bookings = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.bookingCollectionId
    );

    if (bookings.documents.length === 0) {
      console.log("No booking history to clear.");
      return;
    }

    for (const booking of bookings.documents) {
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.bookingCollectionId,
        booking.$id
      );
    }

    console.log("Booking history cleared successfully.");
  } catch (error) {
    console.error("Error clearing booking history:", error);
    throw new Error(error.message);
  }
}

// Sign Out
export async function signOut() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.error("Error signing out:", error);
    throw new Error(error.message);
  }
}
//Driver Sign In
export async function createDriver(
  email,
  password,
  username,
  vehicleRegNumber,
  phoneNumber
) {
  if (!email || !password || !username || !phoneNumber || !vehicleRegNumber) {
    throw new Error(
      "Missing required parameters: email, password, username, vehicleRegNumber, or phoneNumber"
    );
  }
  if (vehicleRegNumber.length !== 8) {
    throw new Error(
      "Vehicle Registration Number must be exactly 9 characters long"
    );
  }
  if (!(phoneNumber.startsWith("2547") && phoneNumber.length === 12)) {
    throw new Error(
      "Phone Number must start with '2547' and be 12 characters long"
    );
  }

  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if (!newAccount) throw new Error("Account creation failed");

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.DriverUserCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
        vehicleRegNumber: vehicleRegNumber,
        phoneNumber: phoneNumber,
      }
    );

    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error(error.message);
  }
}
export async function getCurrentDriverUser() {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw new Error("No current account found");

    const currentDriverUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.DriverUserCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    return currentDriverUser.documents[0];
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}
//get specific driver Bookings
export const getDriverBookings = async (userId) => {
  try {
    const collectionId = "6679c2b0002ac9cceb43"; // Replace with your collection ID
    const response = await databases.listDocuments(collectionId, [
      `userId=${userId}`,
    ]);
    return response.documents;
  } catch (error) {
    throw new Error(error.message);
  }
};
//mark the booking as read
export const markBookingAsRead = async (bookingId) => {
  try {
    const collectionId = "6679c2b0002ac9cceb43"; // Replace with your collection ID
    await databases.updateDocument(collectionId, bookingId, {
      isRead: true,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};
//notify the driver that booking has been received
export async function notifyDriverOnBooking(driverName) {
  try {
    const DriverbookingDetails = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.bookingCollectionId,
      [Query.equal("Driver", driverName)] // Query by Username
    );

    if (
      !DriverbookingDetails ||
      !DriverbookingDetails.documents ||
      DriverbookingDetails.documents.length === 0
    ) {
      throw new Error("No Bookings From Customers found");
    }

    return DriverbookingDetails.documents; // Return all the bookings available in the database from a specific driver.
  } catch (error) {
    console.error("Error getting Booking details:", error);
    throw new Error(error.message); // Propagate the error for handling in your component
  }
}
//get client name in driver portal
export async function getClientDetails(clientId) {
  try {
    const ClientDetails = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("userId", clientId)] // Query by clientId
    );

    if (
      !ClientDetails ||
      !ClientDetails.documents ||
      ClientDetails.documents.length === 0
    ) {
      throw new Error("No Customers found");
    }

    return ClientDetails.documents; // Return all the bookings available in the database from a specific driver.
  } catch (error) {
    console.error("Error getting Booking details:", error);
    throw new Error(error.message); // Propagate the error for handling in your component
  }
}
export async function updateBookingStatus(bookingId, status) {
  try {
    // Fetch the booking document by ID
    const BookingDetails = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.bookingCollectionId,
      bookingId // get the current booking id being triggered
    );

    // Update the booking status
    const updatedBooking = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.bookingCollectionId,
      bookingId,
      {
        status: status,
      }
    );

    return updatedBooking;
  } catch (error) {
    console.error("Error updating booking status:", error);
    throw new Error("Failed to update booking status");
  }
}
