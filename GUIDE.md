# Romeo & Juliet | Ethereal Editorial Wedding Website

Welcome to the documentation for your high-end wedding website. This project features a modern, "Ethereal Editorial" design philosophy, focusing on clean typography, asymmetric layouts, and premium user interactions.

---

## 🎨 Design Philosophy: "Ethereal Editorial"
The website is built using a curated palette of **Rose (#894e56)**, **Olive Gold (#7a5a00)**, and **Cream (#fbf9f5)**. It uses a mix of the elegant **Noto Serif** for headings and the clean, modern **Manrope** for body text and labels, creating a feel similar to a high-end luxury magazine.

---

## 📸 Visual Showcase
*Below are the core sections of the website. You can replace the placeholder paths with your own screenshots.*

### 1. Hero & Branding
The first impression for your guests, featuring a full-bleed parallax background and interactive floating elements.

![Desktop Hero View](images/screenshots/hero-desktop.png)
*Placeholder: Hero Section Desktop*

### 2. Digital RSVP System
A symmetric two-column layout that allows guests to confirm their attendance and leaves a heartfelt message.

![RSVP Section](images/screenshots/rsvp-section.png)
*Placeholder: RSVP Form & Guest Wishes*

### 3. Wedding Gift (Asymmetric)
A sophisticated 12-column grid featuring a grayscale-to-color QRIS card and elegant bank transfer rows.

![Wedding Gift Section](images/screenshots/gift-section.png)
*Placeholder: Gift Section Layout*

---

## ✨ Key Features & Functionality

### 📝 RSVP Management
- **Dynamic List**: When a guest submits their response, it is instantly added to the "Recent Responses" list without refreshing the page.
- **Form Validation**: Ensures all required fields (Name, Attendance, etc.) are filled correctly.
- **Empty State**: Displays a "Be the first to respond" message if no one has replied yet.

### 💳 Modern Wedding Gift
- **Interactive QRIS**: The QR code is minimal/grayscale by default and becomes full color on hover for an interactive feel.
- **Clipboard Utility**: One-click "COPY NUMBER" button for bank accounts.
- **Toast Notifications**: Subtle, dark-themed pop-up notifications provide instant feedback when an account number is copied.

### 📱 Responsive Excellence
- Fully mobile-optimized.
- Sections automatically stack vertically on smaller screens (below 992px) to ensure readability.
- **Horizontal Protection**: Built-in `overflow-x` safety to prevent "white gaps" on the sides during scrolling.

---

## 🛠️ Customization Guide

### 1. Changing Names & Dates
Open `index.html` and search for:
- `Romeo & Juliet` (Update the names)
- `December 31, 2024` (Update the wedding date)

### 2. Updating Bank Details
Search for the `gift-section` in `index.html` and update the account numbers in both the text and the `copyToClipboard()` function:
```html
<button class="copy-btn-refined" onclick="copyToClipboard('YOUR_NUMBER_HERE', this)">
```

### 3. Adjusting Colors
Open `css/main.css` and find the **GIFT SECTION REFINED** or **RSVP SECTION** markers. You can change hex codes for:
- `--primary-rose`: `#894e56`
- `--primary-gold`: `#7a5a00`
- `--surface-container`: `#f5f4ef`

---

## 🏗️ Technical Stack
- **Structure**: HTML5 Semantic Elements
- **Styling**: Vanilla CSS (Modern Grid & Flexbox)
- **Logic**: Vanilla JavaScript (Async/ES6+)
- **Icons**: Material Symbols Outlined

---

*Thank you for letting me help build your special day's digital presence!*
