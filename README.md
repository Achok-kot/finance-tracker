# Student Finance Tracker

A responsive, accessible web application for tracking student expenses with powerful regex validation and search capabilities.

##  Live Demo



##  Features

### Core Features
-  **Transaction Management**: Add, edit, and delete financial transactions
-  **Dashboard Statistics**: View total transactions, spending, top category, and 7-day trends
-  **Budget Monitoring**: Set monthly budget caps with visual progress indicators
-  **Advanced Search**: Regex-powered search with case-sensitive toggle
-  **Sorting**: Sort by date, amount, or description (ascending/descending)
-  **Multi-Currency**: Support for USD, EUR, and GBP with manual exchange rates
-  **Data Persistence**: Auto-save to localStorage
-  **Import/Export**: JSON data import/export with validation
-  **Customizable Categories**: Add/remove expense categories
-  **Fully Responsive**: Mobile-first design (360px, 768px, 1024px+ breakpoints)
-  **Accessible**: WCAG compliant with keyboard navigation and ARIA support

##  Theme

**Student Finance Tracker** - Track expenses across categories: Food, Books, Transport, Entertainment, Fees, and Other.

##  Regex Catalog

### Validation Patterns

| Pattern | Regex | Purpose | Example |
|---------|-------|---------|---------|
| **Description** | `/^\S(?:.*\S)?$/` | No leading/trailing spaces | ✓ "Lunch" ✗ " Lunch " |
| **Amount** | `/^(0\|[1-9]\d*)(\.\d{1,2})?$/` | Valid currency format | ✓ "12.50" ✗ "12.505" |
| **Date** | `/^\d{4}-(0[1-9]\|1[0-2])-(0[1-9]\|[12]\d\|3[01])$/` | YYYY-MM-DD format | ✓ "2025-01-15" ✗ "15-01-2025" |
| **Category** | `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/` | Letters, spaces, hyphens | ✓ "Food" ✓ "Lab-Fees" |
| **Duplicate Word** | `/\b(\w+)\s+\1\b/i` | Catch repeated words (back-reference) | Detects "the the" |

### Search Patterns (Examples)

| Pattern | Purpose | Example Match |
|---------|---------|---------------|
| `coffee\|tea` | Find beverage purchases | "Coffee with friends" |
| `\.\d{2}\b` | Transactions with cents | "$12.50" |
| `^[A-Z]` | Descriptions starting with capital | "Lunch at cafeteria" |
| `\d{2,}` | Amounts with 2+ digits | "$89.99" |

##  Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Navigate between interactive elements |
| `Shift + Tab` | Navigate backwards |
| `Enter` / `Space` | Activate buttons |
| `Escape` | Close modals (if implemented) |
| `Arrow Keys` | Navigate within select dropdowns |

**Skip Link**: Press `Tab` on page load to reveal "Skip to main content" link.

##  Accessibility Features

-  **Semantic HTML**: Proper landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`)
-  **Heading Hierarchy**: Logical H1-H3 structure
-  **Form Labels**: All inputs have associated `<label>` elements
-  **ARIA Live Regions**: Budget cap messages use `aria-live="polite"` (assertive when exceeded)
-  **Focus Indicators**: Visible focus styles on all interactive elements
-  **Color Contrast**: Meets WCAG AA standards (4.5:1 for text)
-  **Keyboard Navigation**: Full keyboard support without mouse
-  **Error Announcements**: Form errors use `role="alert"`
-  **Status Messages**: Toast notifications use `role="status"`

##  Project Structure

```
finance-tracker/
├── index.html              # Main HTML file
├── tests.html              # Regex validation tests
├── seed.json               # Sample data (12 transactions)
├── README.md               # This file
├── styles/
│   └── main.css            # Responsive styles
├── scripts/
│   ├── app.js              # Main application logic
│   ├── state.js            # State management
│   ├── storage.js          # localStorage operations
│   ├── validators.js       # Regex validation functions
│   ├── search.js           # Search & highlight utilities
│   └── ui.js               # DOM rendering functions
└── assets/                 # (Optional images/icons)
```

##  Getting Started

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Achok-kot/Student_Finance_Tracker.git
   cd Student_Finance_Tracker
   ```

2. **Open in browser**
   - Simply open `index.html` in a modern browser
   - Or use a local server:
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Node.js (with http-server)
     npx http-server
     ```

3. **Load sample data**
   - Go to Settings → Data Management
   - Click "Import JSON" and select `seed.json`

### Running Tests

Open `tests.html` in your browser to see regex validation test results.

##  Data Model

Each transaction follows this structure:

```json
{
  "id": "txn_1001",
  "description": "Lunch at cafeteria",
  "amount": 12.50,
  "category": "Food",
  "date": "2025-01-25",
  "createdAt": "2025-01-25T12:30:00.000Z",
  "updatedAt": "2025-01-25T12:30:00.000Z"
}
```

##  Responsive Breakpoints

- **Mobile**: 360px - 767px (single column, stacked cards)
- **Tablet**: 768px - 1023px (2-column stats grid, horizontal transaction cards)
- **Desktop**: 1024px+ (4-column stats grid, optimized spacing)

##  Technologies Used

- **HTML5**: Semantic structure
- **CSS3**: Flexbox, Grid, Custom Properties, Animations
- **JavaScript (ES6+)**: Modules, Arrow Functions, Destructuring
- **localStorage**: Client-side persistence
- **No frameworks**: Vanilla JS only

##  Milestones Completed

- [x] M1: Spec & Wireframes
- [x] M2: Semantic HTML & Base CSS
- [x] M3: Forms & Regex Validation
- [x] M4: Render + Sort + Regex Search
- [x] M5: Stats + Cap/Targets
- [x] M6: Persistence + Import/Export + Settings
- [x] M7: Polish & A11y Audit

##  Contact

- **GitHub**: [@Achok-kot](https://github.com/Achok-kot)
- **Email**: p.kot@alustudent.com




