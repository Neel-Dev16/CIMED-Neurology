"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import {
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaSearch,
  FaUserCircle,
  FaSignOutAlt,
  FaCog,
} from "react-icons/fa"
// Import as a CSS module instead of a global stylesheet
import styles from "./SearchPage.module.css"

const SearchPage = () => {
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState(location.state?.searchTerm || "")
  const [filterColumn, setFilterColumn] = useState(location.state?.filterColumn || "all")
  const [results, setResults] = useState(location.state?.results || [])
  const [userName, setUserName] = useState("")
  const [userRole, setUserRole] = useState("student")
  const [columnAccessEnabled, setColumnAccessEnabled] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user) {
      setUserName(user.first_name)
      setUserRole(user.role)
      console.log("User role set:", user.role)

      axios
        .get("http://localhost:5001/api/admin/settings/column_access_enabled")
        .then((response) => {
          setColumnAccessEnabled(response.data)
        })
        .catch((error) => {
          console.error("Error fetching column access setting:", error)
        })

      // Load search results from localStorage if they exist
      const storedResults = localStorage.getItem("searchResults")
      const storedSearchTerm = localStorage.getItem("searchTerm")
      const storedFilterColumn = localStorage.getItem("filterColumn")

      if (storedResults) {
        try {
          const parsedResults = JSON.parse(storedResults)
          console.log("Loaded stored results:", parsedResults.length)
          setResults(parsedResults)
          setSearchTerm(storedSearchTerm || "")
          setFilterColumn(storedFilterColumn || "all")
        } catch (error) {
          console.error("Error parsing stored results:", error)
          // Clear invalid localStorage data
          localStorage.removeItem("searchResults")
          localStorage.removeItem("searchTerm")
          localStorage.removeItem("filterColumn")
        }
      }
    } else {
      navigate("/login")
    }
  }, [navigate])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    // Clear previous search results from localStorage
    localStorage.removeItem("searchResults")
    localStorage.removeItem("searchTerm")
    localStorage.removeItem("filterColumn")

    try {
      const response = await axios.post("http://localhost:5001/api/projects/search", {
        searchTerm,
        filterColumn,
      })
      setResults(response.data)

      // Store new search results in localStorage
      localStorage.setItem("searchResults", JSON.stringify(response.data))
      localStorage.setItem("searchTerm", searchTerm)
      localStorage.setItem("filterColumn", filterColumn)
    } catch (error) {
      console.error("Error during search:", error)
      setResults([])
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    navigate("/login")
  }

  const goToAdminPanel = () => {
    console.log("Navigating to admin panel")
    navigate("/admin-panel")
  }

  const handleRowClick = (projectId) => {
    // Make sure the current search results are stored before navigation
    if (results.length > 0) {
      localStorage.setItem("searchResults", JSON.stringify(results))
      localStorage.setItem("searchTerm", searchTerm)
      localStorage.setItem("filterColumn", filterColumn)
      console.log("Stored search results before navigation:", results.length)
    }
    navigate(`/project/${projectId}`)
  }

  return (
    <div className={styles.pageWrapper}>
      {/* HEADER SECTION */}
      <div className={styles.pageHeader}>
        <div className={styles.orangeTopBar}></div>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <a href="https://illinois.edu/" className={styles.universityLink}>
              <div className={styles.illinoisLogoBox}>
                <img src="/images/illinois.png" alt="Illinois Logo" className={styles.illinoisLogo} />
              </div>
              <span className={styles.universityName}>UNIVERSITY OF ILLINOIS URBANA-CHAMPAIGN</span>
            </a>
            <a href="/" className={styles.collegeNameLink}>
              <h1 className={styles.collegeName}>Carle Illinois College of Medicine</h1>
            </a>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.userProfile} ref={dropdownRef}>
              <button className={styles.profileButton} onClick={() => setDropdownOpen(!dropdownOpen)}>
                <FaUserCircle className={styles.profileIcon} />
                <span className={styles.profileName}>{userName}</span>
              </button>
              {dropdownOpen && (
                <div className={styles.profileDropdown}>
                  {userRole === "admin" && (
                    <button className={styles.dropdownItem} onClick={goToAdminPanel}>
                      <FaCog className={styles.dropdownIcon} />
                      Admin Panel
                    </button>
                  )}
                  <button className={styles.dropdownItem} onClick={handleLogout}>
                    <FaSignOutAlt className={styles.dropdownIcon} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.headerBorder}></div>
      </div>

      {/* SEARCH SECTION */}
      <main className={styles.mainSection}>
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <h2 className={styles.welcomeText}>Welcome, {userName}!</h2>

            <form onSubmit={handleSearch} className={styles.form}>
              <div className={styles.searchBar}>
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.input}
                />

                <select
                  value={filterColumn}
                  onChange={(e) => setFilterColumn(e.target.value)}
                  className={styles.filter}
                >
                  <option value="all">All Categories</option>
                  <option value="title">Title</option>
                  <option value="keywords">Keywords</option>
                  <option value="needs_statement">Needs Statement</option>
                  <option value="solution">Solution</option>
                </select>

                <button type="submit" className={styles.button}>
                  <FaSearch className={styles.icon} />
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className={styles.resultsSection}>
          <div className={styles.container}>
            {results.length > 0 ? (
              <div className={styles.resultsContainer}>
                <div className={styles.resultsHeader}>
                  <h3 className={styles.resultsTitle}>Search Results</h3>
                  <p className={styles.resultsCount}>Total Results: {results.length}</p>
                </div>
                <div className={styles.tableContainer}>
                  <table className={styles.resultsTable}>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Keywords</th>
                        <th>Needs Statement</th>
                        {(columnAccessEnabled || userRole !== "student") && <th>Solution</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((item) => (
                        <tr
                          key={item.project_id}
                          onClick={() => handleRowClick(item.project_id)}
                          className={styles.resultRow}
                        >
                          <td dangerouslySetInnerHTML={{ __html: item.title }}></td>
                          <td dangerouslySetInnerHTML={{ __html: item.keywords }}></td>
                          <td dangerouslySetInnerHTML={{ __html: item.needs_statement }}></td>
                          {columnAccessEnabled || userRole !== "student" ? (
                            <td dangerouslySetInnerHTML={{ __html: item.solution }}></td>
                          ) : (
                            <td>Admin has disabled access to this resource</td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              searchTerm && (
                <div className={styles.noResults}>
                  <div className={styles.noResultsContent}>
                    <FaSearch className={styles.noResultsIcon} />
                    <h3>No results found</h3>
                    <p>Try adjusting your search terms or filters</p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </main>

      {/* FOOTER SECTION */}
      <footer className={styles.siteFooter}>
        <div className={styles.footerContainer}>
          <div className={styles.footerLeft}>
            <div className={styles.footerLogoContainer}>
              <img
                src="/images/footer.png"
                alt="Carle Illinois College of Medicine Logo"
                className={styles.footerLogo}
              />
            </div>
            <div className={styles.socialIcons}>
              <a href="#" className={styles.socialIcon}>
                <FaTwitter />
              </a>
              <a href="#" className={styles.socialIcon}>
                <FaInstagram />
              </a>
              <a href="#" className={styles.socialIcon}>
                <FaFacebook />
              </a>
              <a href="#" className={styles.socialIcon}>
                <FaLinkedin />
              </a>
            </div>
            <div className={styles.contactInfo}>
              <p>506 South Mathews Ave</p>
              <p>Urbana, IL 61801</p>
              <p>
                Phone: <a href="tel:2173005700">217-300-5700</a>
              </p>
              <p>
                Email: <a href="mailto:medicine@illinois.edu">medicine@illinois.edu</a>
              </p>
            </div>
          </div>
          <div className={styles.footerRight}>
            <h3 className={styles.connectHeading}>Connect</h3>
            <div className={styles.footerDivider}></div>
            <ul className={styles.connectLinks}>
              <li>
                <a href="#">Admissions</a>
              </li>
              <li>
                <a href="#">Carle Health</a>
              </li>
              <li>
                <a href="#">University of Illinois College of Medicine at Urbana-Champaign</a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default SearchPage

