// src/components/Calendar.jsx
import React, { useState, useEffect } from "react"; // Import useState and useEffect
import CalendarVectorIcon from "../assets/calender_vector.png"; // Import the new calendar vector icon

export default function Calendar() {
  // State to hold the current day and date
  const [currentDay, setCurrentDay] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  // useEffect to update the date and day when the component mounts
  useEffect(() => {
    const today = new Date();

    // Format the day of the week (e.g., "MONDAY")
    const optionsDay = { weekday: "long" };
    setCurrentDay(
      new Intl.DateTimeFormat("en-US", optionsDay).format(today).toUpperCase()
    );

    // Format the date as DD/MM/YYYY
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const year = today.getFullYear();
    setCurrentDate(`${day}/${month}/${year}`);
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    // The main container for the Calendar component.
    // Added 'relative' positioning so that the absolutely positioned
    // 'Vector' elements are positioned relative to this container.
    // Using flex-col and gap-4 to stack content vertically.
    <div className="relative w-full p-4 rounded-xl bg-white shadow-lg flex flex-col gap-4">
      {/*
        Vector 1:
        - Positioned absolutely within the parent Calendar container.
        - Spans full width (left-0, right-0).
        - Starts 6.25% from the top and extends to the bottom (bottom-0).
        - Has a black background.
        - Placed behind the main content using z-index -10 (z-0 is default).
      */}
      <div
        className="absolute left-0 right-0 bottom-0 bg-black rounded-xl -z-10"
        style={{ top: "6.25%" }}
      ></div>

      {/*
        Vector 2:
        - Positioned absolutely within the parent Calendar container.
        - Spans full width (left-0, right-0).
        - Starts from the top (top-0) and extends down to 62.5% from the bottom.
        - Has a black background.
        - Placed behind the main content using z-index -10 (z-0 is default).
      */}
      <div
        className="absolute left-0 right-0 top-0 bg-black rounded-xl -z-10"
        style={{ bottom: "62.5%" }}
      ></div>

      {/* This section now contains the Calendar Icon with the date/day overlaid */}
      {/* It's positioned relative to allow absolute positioning of its children (the text) */}
      <div className="relative flex justify-center items-center flex-grow z-10">
        {/* The Calendar Icon image - Increased size slightly to w-28 h-28 for better text visibility */}
        <img
          src={CalendarVectorIcon}
          alt="Calendar Icon"
          className="w-[90px] h-[90px]" // Adjusted size
        />
        {/* Container for the date and day, absolutely positioned over the icon */}
        {/* Using flex-col and items-center to stack text vertically and center it */}
        {/* Applied font-jersey and adjusted text sizes. space-y-0 for minimal gap. */}
        <div
          className="absolute flex flex-col items-center justify-center text-center space-y-0 font-jersey"
          style={{ marginTop: "20px" }}
        >
          {/* Display the current day - font size changed to text-xs */}
          <p
            className="text-[16px] font-medium text-black leading-none jersey-10-regular mt-[25px]"
            style={{ marginBottom: "-16px" }}
          >
            {currentDay}
          </p>
          {/* Display the current date - font size changed to text-sm */}
          <p className="text-[17px] font-semibold text-black leading-none jersey-10-regular">
            {currentDate}
          </p>
        </div>
      </div>

      {/* Removed the original "Calendar Row" section as its content is now inside the icon's container */}
    </div>
  );
}
