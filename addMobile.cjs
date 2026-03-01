const fs = require('fs');

const cssPath = 'c:/Users/srees/Downloads/Poshn/poshn/src/index.css';
let cssContent = fs.readFileSync(cssPath, 'utf8');

// The new block of highly-specific mobile CSS for all remaining UI components
const comprehensiveMobileCSS = `
/* ==============================
   COMPREHENSIVE MOBILE CSS 
   (Android & iPhone Alignments)
   ============================== */
@media (max-width: 768px) {
  /* Global Spacing and Text handling for Mobile */
  body, html {
    overflow-x: hidden;
    width: 100%;
  }

  /* Typography Fixes */
  h1 { font-size: 28px !important; line-height: 1.2 !important; }
  h2 { font-size: 22px !important; line-height: 1.3 !important; }
  h3 { font-size: 18px !important; line-height: 1.4 !important; }
  
  /* Containers & Padding */
  .main-content, .admin-main {
    padding-bottom: 90px !important; /* Space for sticky bottom nav */
    padding-left: 14px !important;
    padding-right: 14px !important;
    padding-top: 14px !important;
  }
  
  .page-header, .admin-page-header {
    padding: 12px 14px !important;
    flex-wrap: wrap; 
    gap: 10px;
  }

  .admin-sidebar, .sidebar {
     border-top-left-radius: 20px;
     border-top-right-radius: 20px;
     box-shadow: 0 -10px 30px rgba(0,0,0,0.1) !important;
  }

  /* All Grids & Flex Layouts */
  div[style*="display: grid"], 
  div[style*="grid-template-columns"], 
  .dashboard-stats, 
  .features-grid, 
  .stats-grid {
    grid-template-columns: 1fr !important;
    gap: 12px !important;
  }

  div[style*="display: flex"] {
    /* Auto-wrap long flex rows that don't have explicit nowrap */
    flex-wrap: wrap;
  }

  /* specific overrides to keep some item horizontal */
  .page-header-right, 
  .search-input-wrap, 
  .meal-card, 
  .doctor-card,
  .appt-card,
  .pill,
  .btn,
  .day-tabs {
     flex-wrap: nowrap !important;
  }

  /* Cards */
  .card, .card-green, .card-glass, .card-raised {
    padding: 16px !important;
    width: 100% !important;
    box-sizing: border-box;
    margin-bottom: 6px;
  }
  
  /* Auth / Choice Screens */
  .auth-screen {
     padding: 0 !important;
  }
  .auth-right {
     padding: 24px 16px !important;
  }
  .auth-left {
     padding: 24px 16px !important;
  }

  /* Choice Cards Alignment */
  .choice-cards-container {
     display: flex !important;
     flex-direction: column !important;
     width: 100% !important;
  }
  
  div[style*="gridTemplateColumns: '1fr 1fr'"],
  div[style*="grid-template-columns: 1fr 1fr"] {
     display: flex !important;
     flex-direction: column !important;
     width: 100% !important;
  }

  /* Dashboard specific widgets */
  .widget-chart-area, .progress-circle-wrap {
     width: 100% !important;
     max-width: 100% !important;
     display: flex;
     justify-content: center;
  }

  /* Admin Tables & Lists */
  table, thead, tbody, th, td, tr { 
		display: block; 
	}
	
	/* Hide table headers (but not display: none;, for accessibility) */
	thead tr { 
		position: absolute;
		top: -9999px;
		left: -9999px;
	}
	
	tr { border: 1px solid var(--gray-200); margin-bottom: 12px; border-radius: 12px; padding: 10px; background: white;}
	
	td { 
		/* Behave  like a "row" */
		border: none;
		border-bottom: 1px solid var(--gray-100); 
		position: relative;
		padding-left: 50% !important; 
        text-align: right !important;
        min-height: 40px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
	}
	
	td:before { 
		/* Now like a table header */
		position: absolute;
		top: 50%;
		left: 10px;
        transform: translateY(-50%);
		width: 45%; 
		padding-right: 10px; 
		white-space: nowrap;
        text-align: left;
        font-weight: 600;
        font-size: 12px;
        color: var(--gray-500);
        content: attr(data-label);
	}

  .admin-table-wrap {
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
      padding: 0 !important;
  }
}
`;

// Append only if it doesn't already contain the new marker
if (!cssContent.includes('COMPREHENSIVE MOBILE CSS')) {
    fs.writeFileSync(cssPath, cssContent + '\n' + comprehensiveMobileCSS);
    console.log('Mobile styles appended successfully!');
} else {
    console.log('Mobile styles already exist.');
}
