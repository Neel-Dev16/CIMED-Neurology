"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { FaUserCircle, FaSignOutAlt, FaArrowLeft, FaSave, FaTimes } from "react-icons/fa"
import "./AddEntry.css"

const AddEntry = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    keywords: "",
    observation: "",
    scoping: "",
    needs_statement: "",
    state_of_art: "",
    solution: "",
    solution_category: "",
    literature: "",
    acknowledgement: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [userName, setUserName] = useState("")
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useState(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user) {
      setUserName(user.first_name)
    } else {
      navigate("/login")
    }
  }, [navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await axios.post("http://localhost:5001/api/admin/projects", formData)
      setLoading(false)
      navigate("/admin-panel")
    } catch (error) {
      console.error("Error adding entry:", error)
      setError(error.response?.data?.message || "Failed to add project. Please try again.")
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    navigate("/login")
  }

  const handleCancel = () => {
    navigate("/admin-panel")
  }

  return (
    <div className="add-entry-wrapper">
      {/* HEADER SECTION */}
      <header className="add-entry-header">
        <div className="orange-top-bar"></div>
        <div className="add-entry-header-content">
          <div className="add-entry-header-left">
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
          <div className="add-entry-header-right">
            <div className="add-entry-user-profile">
              <button className="add-entry-profile-button" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <FaUserCircle className="add-entry-profile-icon" />
                <span className="add-entry-profile-name">{userName}</span>
              </button>
              {dropdownOpen && (
                <div className="add-entry-profile-dropdown">
                  <button className="add-entry-dropdown-item" onClick={handleLogout}>
                    <FaSignOutAlt className="add-entry-dropdown-icon" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="add-entry-header-border"></div>
      </header>

      {/* MAIN CONTENT */}
      <main className="add-entry-main-content">
        <div className="add-entry-page-header">
          <h1 className="add-entry-page-title">Add New Project</h1>
          <p className="add-entry-subtitle">Fill in the details to add a new project to the database</p>
        </div>

        {error && <div className="add-entry-error-message">{error}</div>}

        <div className="add-entry-form-container">
          <div className="add-entry-form-header">
            <button className="add-entry-back-button" onClick={handleCancel}>
              <FaArrowLeft className="add-entry-back-icon" /> Back to Admin Panel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="add-entry-form">
            <div className="add-entry-form-grid">
              {/* Short text fields in a two-column layout */}
              <div className="add-entry-form-row">
                <div className="add-entry-form-group">
                  <label htmlFor="title" className="add-entry-form-label">
                    Title
                  </label>
                  <textarea
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="add-entry-form-input"
                    rows={2}
                    required
                  />
                </div>
                <div className="add-entry-form-group">
                  <label htmlFor="keywords" className="add-entry-form-label">
                    Keywords
                  </label>
                  <textarea
                    id="keywords"
                    name="keywords"
                    value={formData.keywords}
                    onChange={handleChange}
                    className="add-entry-form-input"
                    rows={2}
                    required
                    placeholder="Separate keywords with commas"
                  />
                </div>
              </div>

              <div className="add-entry-form-row">
                <div className="add-entry-form-group">
                  <label htmlFor="solution_category" className="add-entry-form-label">
                    Solution Category
                  </label>
                  <textarea
                    id="solution_category"
                    name="solution_category"
                    value={formData.solution_category}
                    onChange={handleChange}
                    className="add-entry-form-input"
                    rows={2}
                    required
                  />
                </div>
                <div className="add-entry-form-group">
                  <label htmlFor="acknowledgement" className="add-entry-form-label">
                    Acknowledgement
                  </label>
                  <textarea
                    id="acknowledgement"
                    name="acknowledgement"
                    value={formData.acknowledgement}
                    onChange={handleChange}
                    className="add-entry-form-input"
                    rows={2}
                    required
                  />
                </div>
              </div>

              {/* Large text fields in full width */}
              <div className="add-entry-form-group add-entry-large-field">
                <label htmlFor="observation" className="add-entry-form-label">
                  Observation
                </label>
                <textarea
                  id="observation"
                  name="observation"
                  value={formData.observation}
                  onChange={handleChange}
                  className="add-entry-form-input"
                  rows={6}
                  required
                />
              </div>

              <div className="add-entry-form-group add-entry-large-field">
                <label htmlFor="needs_statement" className="add-entry-form-label">
                  Needs Statement
                </label>
                <textarea
                  id="needs_statement"
                  name="needs_statement"
                  value={formData.needs_statement}
                  onChange={handleChange}
                  className="add-entry-form-input"
                  rows={6}
                  required
                />
              </div>

              <div className="add-entry-form-group add-entry-large-field">
                <label htmlFor="scoping" className="add-entry-form-label">
                  Scoping
                </label>
                <textarea
                  id="scoping"
                  name="scoping"
                  value={formData.scoping}
                  onChange={handleChange}
                  className="add-entry-form-input"
                  rows={4}
                  required
                />
              </div>

              <div className="add-entry-form-group add-entry-large-field">
                <label htmlFor="state_of_art" className="add-entry-form-label">
                  State of Art
                </label>
                <textarea
                  id="state_of_art"
                  name="state_of_art"
                  value={formData.state_of_art}
                  onChange={handleChange}
                  className="add-entry-form-input"
                  rows={6}
                  required
                />
              </div>

              <div className="add-entry-form-group add-entry-large-field">
                <label htmlFor="solution" className="add-entry-form-label">
                  Solution
                </label>
                <textarea
                  id="solution"
                  name="solution"
                  value={formData.solution}
                  onChange={handleChange}
                  className="add-entry-form-input"
                  rows={8}
                  required
                />
              </div>

              <div className="add-entry-form-group add-entry-large-field">
                <label htmlFor="literature" className="add-entry-form-label">
                  Literature
                </label>
                <textarea
                  id="literature"
                  name="literature"
                  value={formData.literature}
                  onChange={handleChange}
                  className="add-entry-form-input"
                  rows={6}
                  required
                  placeholder="Add literature references, one per line"
                />
              </div>
            </div>

            <div className="add-entry-form-actions">
              <button type="button" className="add-entry-cancel-button" onClick={handleCancel}>
                <FaTimes className="add-entry-button-icon" /> Cancel
              </button>
              <button type="submit" className="add-entry-submit-button" disabled={loading}>
                <FaSave className="add-entry-button-icon" /> {loading ? "Saving..." : "Save Project"}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* FOOTER SECTION */}
      <footer className="add-entry-footer">
        <div className="add-entry-footer-container">
          <div className="add-entry-footer-left">
            <a href="/" className="add-entry-footer-logo-link">
              <img
                src="/images/footer.png"
                alt="Carle Illinois College of Medicine Logo"
                className="add-entry-footer-logo"
              />
            </a>
            <div className="add-entry-social-icons">
              <a href="#" className="add-entry-social-icon">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="add-entry-social-icon">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="add-entry-social-icon">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="add-entry-social-icon">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
            <div className="add-entry-contact-info">
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
          <div className="add-entry-footer-right">
            <h3 className="add-entry-connect-heading">Connect</h3>
            <div className="add-entry-footer-divider"></div>
            <ul className="add-entry-connect-links">
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

export default AddEntry

