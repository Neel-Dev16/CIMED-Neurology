// Add this script to your project to handle table scrolling indicators
document.addEventListener("DOMContentLoaded", () => {
    const tableContainer = document.querySelector(".admin-table-container")
    const leftIndicator = document.querySelector(".admin-scroll-left")
    const rightIndicator = document.querySelector(".admin-scroll-right")
  
    if (!tableContainer || !leftIndicator || !rightIndicator) return
  
    // Check if scrolling is possible
    function checkScroll() {
      const hasHorizontalScroll = tableContainer.scrollWidth > tableContainer.clientWidth
      const atLeftEdge = tableContainer.scrollLeft <= 0
      const atRightEdge = tableContainer.scrollLeft + tableContainer.clientWidth >= tableContainer.scrollWidth - 5
  
      // Show/hide indicators based on scroll position
      leftIndicator.style.opacity = hasHorizontalScroll && !atLeftEdge ? "1" : "0"
      rightIndicator.style.opacity = hasHorizontalScroll && !atRightEdge ? "1" : "0"
    }
  
    // Scroll left when left indicator is clicked
    leftIndicator.addEventListener("click", () => {
      tableContainer.scrollBy({ left: -300, behavior: "smooth" })
    })
  
    // Scroll right when right indicator is clicked
    rightIndicator.addEventListener("click", () => {
      tableContainer.scrollBy({ left: 300, behavior: "smooth" })
    })
  
    // Check scroll on load and when scrolling
    tableContainer.addEventListener("scroll", checkScroll)
    window.addEventListener("resize", checkScroll)
  
    // Initial check
    checkScroll()
  })
  
  