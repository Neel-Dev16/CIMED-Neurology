"use client"

import { useRef } from "react"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import {
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaArrowLeft,
  FaExternalLinkAlt,
  FaUserCircle,
  FaSignOutAlt,
  FaCog,
} from "react-icons/fa"
import {
  FaLightbulb,
  FaMagnifyingGlass,
  FaCircleQuestion,
  FaCircleInfo,
  FaPuzzlePiece,
  FaLayerGroup,
  FaBook,
  FaHeart,
} from "react-icons/fa6"
import styles from "./ProjectDetails.module.css"

const ProjectDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [userName, setUserName] = useState("")
  const [userRole, setUserRole] = useState("student")
  const [columnAccessEnabled, setColumnAccessEnabled] = useState(true)
  const [loading, setLoading] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user) {
      setUserName(user.first_name)
      setUserRole(user.role)

      axios
        .get("http://localhost:5001/api/admin/settings/column_access_enabled")
        .then((response) => {
          setColumnAccessEnabled(response.data)
        })
        .catch((error) => {
          console.error("Error fetching column access setting:", error)
        })
    } else {
      navigate("/login")
    }

    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/projects/${id}`)
        setProject(response.data)
      } catch (error) {
        console.error("Error fetching project details:", error)
        setErrorMessage("Failed to load project details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchProjectDetails()

    // No cleanup function that removes localStorage items
  }, [id, navigate])

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

  const hasAccess = (fieldName) => {
    if (userRole !== "student") return true
    if (columnAccessEnabled) return true
    return !["solution", "solution_category", "literature", "acknowledgement"].includes(fieldName)
  }

  const renderField = (fieldValue, fieldName) => {
    if (!hasAccess(fieldName)) {
      return "Admin has disabled access to this resource"
    }
    return fieldValue || "No information available"
  }

  const handleBackClick = () => {
    // Check if we have search results in localStorage before navigating back
    const storedResults = localStorage.getItem("searchResults")
    if (storedResults) {
      console.log("Search results exist in localStorage, navigating back")
    } else {
      console.log("No search results in localStorage")
    }
    navigate(-1) // Go back to previous page (search results)
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    navigate("/login")
  }

  const goToAdminPanel = () => {
    navigate("/admin-panel")
  }

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        {/* Header */}
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

        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading project details...</p>
        </div>

        {/* Footer */}
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

  if (errorMessage) {
    return (
      <div className={styles.pageWrapper}>
        {/* Header */}
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

        <div className={styles.errorContainer}>
          <div className={styles.errorMessage}>{errorMessage}</div>
          <button className={styles.backButton} onClick={handleBackClick}>
            <FaArrowLeft className={styles.backIcon} />
            Back to Search
          </button>
        </div>

        {/* Footer */}
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

  // Parse keywords into an array
  const keywords = project.keywords ? project.keywords.split(",").map((k) => k.trim()) : []

  return (
    <div className={styles.pageWrapper}>
      {/* Header */}
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

      {/* Main content */}
      <main className={styles.mainContent}>
        <div className={styles.actionBar}>
          <button className={styles.backButton} onClick={handleBackClick}>
            <FaArrowLeft className={styles.backIcon} />
            Back to Search
          </button>
          <span className={styles.dateInfo}>Created: {new Date(project.created_at).toLocaleDateString()}</span>
        </div>

        <div className={styles.projectHeader}>
          <h1 className={styles.projectTitle}>{project.title}</h1>

          <div className={styles.keywordsContainer}>
            {keywords.map((keyword, index) => (
              <span key={index} className={styles.keywordTag}>
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.cardsGrid}>
          {/* Observation */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <FaLightbulb className={styles.cardIcon} />
              <h2 className={styles.cardTitle}>Observation</h2>
            </div>
            <div className={styles.cardContent}>
              <p>{project.observation || "No observation provided"}</p>
            </div>
          </div>

          {/* Scoping */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <FaMagnifyingGlass className={styles.cardIcon} />
              <h2 className={styles.cardTitle}>Scoping</h2>
            </div>
            <div className={styles.cardContent}>
              <p>{project.scoping || "No scoping information provided"}</p>
            </div>
          </div>

          {/* Needs Statement */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <FaCircleQuestion className={styles.cardIcon} />
              <h2 className={styles.cardTitle}>Needs Statement</h2>
            </div>
            <div className={styles.cardContent}>
              <p>{project.needs_statement || "No needs statement provided"}</p>
            </div>
          </div>

          {/* State of Art */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <FaCircleInfo className={styles.cardIcon} />
              <h2 className={styles.cardTitle}>State of Art</h2>
            </div>
            <div className={styles.cardContent}>
              <p>{project.state_of_art || "No state of art information provided"}</p>
            </div>
          </div>

          {/* Solution */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <FaPuzzlePiece className={styles.cardIcon} />
              <h2 className={styles.cardTitle}>Solution</h2>
            </div>
            <div className={styles.cardContent}>
              <p>{renderField(project.solution, "solution")}</p>
            </div>
          </div>

          {/* Solution Category */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <FaLayerGroup className={styles.cardIcon} />
              <h2 className={styles.cardTitle}>Solution Category</h2>
            </div>
            <div className={styles.cardContent}>
              <p>{renderField(project.solution_category, "solution_category")}</p>
            </div>
          </div>

          {/* Literature */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <FaBook className={styles.cardIcon} />
              <h2 className={styles.cardTitle}>Literature</h2>
            </div>
            <div className={styles.cardContent}>
              {hasAccess("literature") ? (
                project.literature ? (
                  <div className={styles.literatureLinks}>
                    {project.literature.split("\n").map((link, index) => (
                      <a
                        key={index}
                        href={link.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.externalLink}
                      >
                        Reference {index + 1} <FaExternalLinkAlt className={styles.linkIcon} />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p>No literature references provided</p>
                )
              ) : (
                <p>Admin has disabled access to this resource</p>
              )}
            </div>
          </div>

          {/* Acknowledgements */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <FaHeart className={styles.cardIcon} />
              <h2 className={styles.cardTitle}>Acknowledgements</h2>
            </div>
            <div className={styles.cardContent}>
              <p>{renderField(project.acknowledgement, "acknowledgement")}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
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

export default ProjectDetails

