"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaToggleOn,
  FaToggleOff,
  FaSearch,
  FaUserCircle,
  FaSignOutAlt,
  FaTable,
  FaChartLine,
  FaUsers,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa"
import "./AdminPanel.css"

const AdminPanel = () => {
  const [projects, setProjects] = useState([])
  const [editRowId, setEditRowId] = useState(null)
  const [formData, setFormData] = useState({})
  const [error, setError] = useState("")
  const [loginEnabled, setLoginEnabled] = useState(true)
  const [columnAccessEnabled, setColumnAccessEnabled] = useState(true)
  const [loadingSettings, setLoadingSettings] = useState(true)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [userName, setUserName] = useState("")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is admin, if not redirect to login
    const user = JSON.parse(localStorage.getItem("user"))
    if (!user || user.role !== "admin") {
      navigate("/login")
    } else {
      setUserName(user.first_name)
    }

    const fetchData = async () => {
      try {
        const [projectsResponse, loginSettingsResponse, columnAccessResponse] = await Promise.all([
          axios.get("http://localhost:5001/api/admin/projects"),
          axios.get("http://localhost:5001/api/admin/settings/student_login_enabled"),
          axios.get("http://localhost:5001/api/admin/settings/column_access_enabled"),
        ])

        setProjects(projectsResponse.data)
        setLoginEnabled(loginSettingsResponse.data)
        setColumnAccessEnabled(columnAccessResponse.data)
      } catch (error) {
        console.error("Error fetching data:", error)
        setError("Failed to load data")
      } finally {
        setLoading(false)
        setLoadingSettings(false)
      }
    }
    fetchData()
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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await axios.delete(`http://localhost:5001/api/admin/projects/${id}`)
        setProjects(projects.filter((project) => project.project_id !== id))
      } catch (error) {
        console.error("Error deleting project:", error)
        setError("Failed to delete project")
      }
    }
  }

  const handleEdit = (id) => {
    setEditRowId(id)
    const projectToEdit = projects.find((project) => project.project_id === id)
    setFormData(projectToEdit)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (id) => {
    try {
      await axios.put(`http://localhost:5001/api/admin/projects/${id}`, formData)
      setProjects(projects.map((project) => (project.project_id === id ? { ...project, ...formData } : project)))
      setEditRowId(null)
    } catch (error) {
      console.error("Error updating project:", error)
      setError("Failed to update project")
    }
  }

  const handleToggleLogin = async () => {
    const newValue = !loginEnabled
    try {
      await axios.put("http://localhost:5001/api/admin/settings/student_login_enabled", { value: newValue })
      setLoginEnabled(newValue)
    } catch (error) {
      console.error("Error updating login setting:", error)
      setError("Failed to update login setting")
    }
  }

  const handleToggleColumnAccess = async () => {
    const newValue = !columnAccessEnabled
    try {
      await axios.put("http://localhost:5001/api/admin/settings/column_access_enabled", { value: newValue })
      setColumnAccessEnabled(newValue)
    } catch (error) {
      console.error("Error updating column access:", error)
      setError("Failed to update column access")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    navigate("/login")
  }

  // Filter projects based on search term
  const filteredProjects = searchTerm
    ? projects.filter(
        (project) =>
          project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.keywords?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.needs_statement?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : projects

  // Display all columns in the table
  const displayColumns = [
    "title",
    "keywords",
    "observation",
    "scoping",
    "needs_statement",
    "state_of_art",
    "solution",
    "solution_category",
    "literature",
    "acknowledgement",
  ]

  if (loading) {
    return (
      <div className="admin-loading-container">
        <div className="admin-loading-spinner"></div>
        <p>Loading admin panel...</p>
      </div>
    )
  }

  return (
    <div className="admin-page-wrapper">
      {/* HEADER SECTION */}
      <header className="admin-header">
        <div className="orange-top-bar"></div>
        <div className="admin-header-content">
          <div className="admin-header-left">
            <a href="https://illinois.edu/" className="university-link">
              <div className="illinois-logo-box">
                <img src="/images/illinois.png" alt="Illinois Logo" className="illinois-logo" />
              </div>
              <span className="university-name">UNIVERSITY OF ILLINOIS URBANA-CHAMPAIGN</span>
            </a>
            <a href="/" className="college-name-link">
              <h1 className="college-name">Carle Illinois College of Medicine</h1>
            </a>
          </div>
          <div className="admin-header-right">
            <div className="admin-user-profile" ref={dropdownRef}>
              <button className="admin-profile-button" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <FaUserCircle className="admin-profile-icon" />
                <span className="admin-profile-name">{userName}</span>
              </button>
              {dropdownOpen && (
                <div className="admin-profile-dropdown">
                  <button className="admin-dropdown-item" onClick={handleLogout}>
                    <FaSignOutAlt className="admin-dropdown-icon" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="admin-header-border"></div>
      </header>

      {/* MAIN CONTENT */}
      <main className="admin-main-content">
        <div className="admin-dashboard-header">
          <div className="admin-title-section">
            <h1 className="admin-page-title">Admin Dashboard</h1>
            <p className="admin-subtitle">Manage projects and system settings</p>
          </div>

          <div className="admin-stats-cards">
            <div className="admin-stat-card">
              <div className="admin-stat-icon">
                <FaTable />
              </div>
              <div className="admin-stat-info">
                <span className="admin-stat-value">{projects.length}</span>
                <span className="admin-stat-label">Total Projects</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon">
                <FaUsers />
              </div>
              <div className="admin-stat-info">
                <span className="admin-stat-value">{loginEnabled ? "Enabled" : "Disabled"}</span>
                <span className="admin-stat-label">Student Login</span>
              </div>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-icon">
                <FaChartLine />
              </div>
              <div className="admin-stat-info">
                <span className="admin-stat-value">{columnAccessEnabled ? "Enabled" : "Disabled"}</span>
                <span className="admin-stat-label">Column Access</span>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-controls-section">
          <div className="admin-settings-toggles">
            <div className="admin-toggle-item">
              <span className="admin-toggle-label">Student Login:</span>
              <button className="admin-toggle-button" onClick={handleToggleLogin} aria-label="Toggle student login">
                {loginEnabled ? (
                  <FaToggleOn className="admin-toggle-on" />
                ) : (
                  <FaToggleOff className="admin-toggle-off" />
                )}
              </button>
            </div>
            <div className="admin-toggle-item">
              <span className="admin-toggle-label">Column Access:</span>
              <button
                className="admin-toggle-button"
                onClick={handleToggleColumnAccess}
                aria-label="Toggle column access"
              >
                {columnAccessEnabled ? (
                  <FaToggleOn className="admin-toggle-on" />
                ) : (
                  <FaToggleOff className="admin-toggle-off" />
                )}
              </button>
            </div>
          </div>

          <div className="admin-search-add">
            <div className="admin-search-bar">
              <FaSearch className="admin-search-icon" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="admin-search-input"
              />
            </div>
            <a href="/admin-panel/add-entry" className="admin-add-button">
              <FaPlus className="admin-add-icon" /> Add Project
            </a>
          </div>
        </div>

        {error && <div className="admin-error-message">{error}</div>}

        <div className="admin-table-wrapper">
          <div className="admin-scroll-indicator admin-scroll-left">
            <FaChevronLeft />
          </div>
          <div className="admin-scroll-indicator admin-scroll-right">
            <FaChevronRight />
          </div>

          <div className="admin-table-container">
            <table className="admin-projects-table">
              <thead>
                <tr>
                  <th className="admin-id-column">ID</th>
                  {displayColumns.map((column) => (
                    <th key={column}>{column.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</th>
                  ))}
                  <th className="admin-actions-column">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => (
                  <tr key={project.project_id}>
                    <td className="admin-id-column">{project.project_id}</td>
                    {displayColumns.map((column) => (
                      <td key={`${project.project_id}-${column}`}>
                        {editRowId === project.project_id ? (
                          <textarea
                            name={column}
                            value={formData[column] || ""}
                            onChange={handleInputChange}
                            className="admin-edit-input"
                            rows={3}
                          />
                        ) : (
                          <div className="admin-cell-content">
                            {project[column]?.length > 100
                              ? `${project[column].substring(0, 100)}...`
                              : project[column] || "N/A"}
                          </div>
                        )}
                      </td>
                    ))}
                    <td className="admin-actions-column">
                      {editRowId === project.project_id ? (
                        <button
                          className="admin-save-button"
                          onClick={() => handleSubmit(project.project_id)}
                          aria-label="Save changes"
                        >
                          Save
                        </button>
                      ) : (
                        <div className="admin-action-buttons">
                          <button
                            className="admin-edit-button"
                            onClick={() => handleEdit(project.project_id)}
                            aria-label="Edit project"
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            className="admin-delete-button"
                            onClick={() => handleDelete(project.project_id)}
                            aria-label="Delete project"
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* FOOTER SECTION */}
      <footer className="admin-footer">
        <div className="admin-footer-container">
          <div className="admin-footer-left">
            <a href="/" className="admin-footer-logo-link">
              <img
                src="/images/footer.png"
                alt="Carle Illinois College of Medicine Logo"
                className="admin-footer-logo"
              />
            </a>
            <div className="admin-social-icons">
              <a href="#" className="admin-social-icon">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="admin-social-icon">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="admin-social-icon">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="admin-social-icon">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
            <div className="admin-contact-info">
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
          <div className="admin-footer-right">
            <h3 className="admin-connect-heading">Connect</h3>
            <div className="admin-footer-divider"></div>
            <ul className="admin-connect-links">
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

export default AdminPanel

