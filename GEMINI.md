# Gemini Project Guide: Roomus Listings

This document outlines my understanding of the project and the tasks I need to complete based on the `README.md`.

## 🎯 My Main Goal

My primary objective is to build the "Room Listings" feature for the Roomus application. This involves creating two main pages and the surrounding functionality:

1.  **Listings Page**: A page to browse and view available rooms.
2.  **Room Detail Page**: A page to view detailed information about a specific room.

### Key Features to Implement:

*   **Filtering**: Users should be able to filter rooms by:
    *   City/Neighborhood
    *   Budget Range (now fully functional with correct filtering logic)
    *   Room Type
    *   Move-in Date
    *   Amenities (displaying "Washing Machine" instead of "washing_machine")
*   **Filter Counts**: Display the amount of available rooms for each filter option, dynamically updating based on other active filters.
*   **Sorting**: Users should be able to sort rooms by:
    *   Newest
    *   Price (Ascending/Descending)
*   **Pagination/Infinite Scroll**: For browsing through a large number of rooms.
*   **Responsive UI**: The layout must work on both mobile and desktop.
*   **URL Updates**: Filters and sorting options should be reflected in the URL to make the page shareable.
*   **Contact Feature**: A "Contact" button on the room detail page that interacts with the mock API.

### Optional/Encouraged Features:

*   Saved/Favorite Rooms (using localStorage)
*   Map View
*   Enhanced Roommate Information
*   UI/UX Polish (e.g., skeleton loaders, transitions)

## 🗂 My Working Directory

I will primarily work within the `src/features/listings/` directory.

*   **Components**: `src/features/listings/components/`
*   **Pages**: `src/features/listings/pages/`

I can also modify:

*   `mocks/fixtures/rooms.json`: To add more test data.
*   `mocks/handlers.js`: To extend mock API endpoints if necessary.

## 🚫 What I Will Not Touch

I will avoid making changes to the following files as per the instructions:

*   `App.jsx`
*   `main.jsx`
*   `api/client.js`

## 🧑‍💻 Coding Guidelines I Will Follow

*   **CSS**: Use CSS Modules or prefix classes with `.rm-` to avoid global scope leakage.
*   **API**: Use the provided functions in `api/rooms.js` (`searchRooms`, `getRoom`, `contactRoom`).
*   **React**: Use functional components and hooks.
*   **File Structure**: One component per file, with `PascalCase` naming for components.
*   **Git**: Work on feature branches and create clear Pull Requests.

## 🚀 How I Will Get Started

1.  Ensure dependencies are installed with `npm install`.
2.  Start the development server with `npm run dev`.
3.  Begin by building out the core components, starting with the `RoomCard` and the main `ListingsPage`.
