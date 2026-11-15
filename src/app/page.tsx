
"use client";
// Import useState to manage the submitted state of the survey.
// Import FormEvent to define the type of the form submission event.

import { useState, FormEvent } from "react";

// Import the CSS file that controls the styling of the survey.
import "./globals.css";
// Home is the main component that displays the survey page.
export default function Home() {

  // Create a state variable to track whether the survey has been submitted.
  // Initially, submitted is false, meaning the survey form is displayed.
  const [submitted, setSubmitted] = useState(false);
  // This function runs when the user clicks the Submit Survey button.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    // The main element contains the entire survey page.
    <main className="page">
       {/* Container keeps the survey content together and controls its width. */}
      <div className="survey-container">
        <header className="survey-header">
          <div className="logo">C23</div>
          <p className="company-name">CLOUD23</p>
          <h1>Developer Team Survey</h1>
          <p className="subtitle">
            We value your feedback. Help us improve how we work together.
          </p>
          <div className="survey-info">
            <span>12 Questions</span>
            <span>•</span>
            <span>5–10 Minutes</span>
          </div>
        </header>
            {/* Conditional rendering:
            If submitted is true, display the success message.
            Otherwise, display the survey form. */}
        {submitted ? (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h2>Thank you for your feedback!</h2>
            <p>Your survey has been submitted successfully.</p>
            <p className="demo-note">
              This is a frontend demo. Your responses have not been saved.
            </p>
             {/* Clicking this button resets the submitted state
                and displays the survey form again. */}
            <button
              type="button"
              className="submit-button"
              onClick={() => setSubmitted(false)}
            >
              Back to Survey
            </button>
          </div>
        ) : (
            // The survey form is displayed when submitted is false.
          <form onSubmit={handleSubmit}>
            <section className="form-section">
              <h2>01. About You</h2>

              <div className="form-group">
                <label htmlFor="role">1. What is your role?</label>
                <select id="role" name="role" required defaultValue="">
                  <option value="" disabled>Select your role</option>
                  <option>Frontend Developer</option>
                  <option>Backend Developer</option>
                  <option>Full-Stack Developer</option>
                  <option>Salesforce Developer</option>
                  <option>QA Automation Engineer</option>
                  <option>Team Lead</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="form-group">
                 {/* htmlFor connects the label to the dropdown using its ID. */}
                <label htmlFor="experience">
                  2. How long have you been part of Cloud23?
                </label>
                <select id="experience" name="experience" required defaultValue="">
                  <option value="" disabled>Select your experience</option>
                  <option>Less than 6 months</option>
                  <option>6 months – 1 year</option>
                  <option>1 – 2 years</option>
                  <option>More than 2 years</option>
                </select>
              </div>
            </section>

            <section className="form-section">
              <h2>02. Teamwork</h2>

              <div className="form-group">
                <label>3. How would you rate communication within the team?</label>
                <Rating name="communication" />
              </div>

              <div className="form-group">
                <label>4. Do team members work well together?</label>
                <Rating name="teamwork" />
              </div>

              <div className="form-group">
                <label>5. Do you feel comfortable asking for help?</label>
                <Rating name="support" />
              </div>
            </section>

            <section className="form-section">
              <h2>03. Frontend Development</h2>

              <div className="form-group">
                <label>6. Do you have the tools and resources you need?</label>
                
                <Rating name="resources" />
              </div>

              <div className="form-group">
                <label>7. Are tasks and requirements clear?</label>
                <Rating name="requirements" />
              </div>

              <div className="form-group">
                <label htmlFor="challenges">
                  8. What challenges do you experience when working on the frontend?
                </label>
                <textarea
                  id="challenges"
                  name="challenges"
                  placeholder="Share your challenges..."
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label htmlFor="improvements">
                  9. What would you like to improve in frontend development?
                </label>
                <textarea
                  id="improvements"
                  name="improvements"
                  placeholder="Share your suggestions..."
                  rows={4}
                />
              </div>
            </section>

            <section className="form-section">
              <h2>04. General Feedback</h2>

              <div className="form-group">
                <label htmlFor="enjoy">
                  10. What do you enjoy most about working at Cloud23?
                </label>
                <textarea id="enjoy" name="enjoy" rows={3} />
              </div>

              <div className="form-group">
                <label htmlFor="improve">
                  11. What is one thing the team could improve?
                </label>
                <textarea id="improve" name="improve" rows={3} />
              </div>

              <div className="form-group">
                <label htmlFor="suggestions">
                  12. Do you have any other suggestions?
                </label>
                <textarea id="suggestions" name="suggestions" rows={3} />
              </div>
            </section>

            <button type="submit" className="submit-button">
              Submit Survey
            </button>

            <p className="privacy-note">
              Your feedback is important to us.
            </p>
          </form>
        )}

        <footer>
          © 2026 Cloud23. Developer Team Survey.
        </footer>
      </div>
    </main>
  );
}
// Reusable Rating component.
// It accepts a name property to identify which survey question it belongs to.
function Rating({ name }: { name: string }) {
  return (
    
    <div className="rating-options">
      {/* map() loops through numbers 1 to 5 and creates a radio button
          for each rating option. */}
      {[1, 2, 3, 4, 5].map((number) => (
        <label key={number} className="rating-option">
          <input
            type="radio"
            name={name}
            value={number}
            required
          />
          <span>{number}</span>
        </label>
      ))}
      <div className="rating-labels">
        <span>Poor</span>
        <span>Excellent</span>
      </div>
    </div>
  );
}
