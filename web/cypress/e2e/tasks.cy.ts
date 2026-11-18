describe("Mini Task Tracker", () => {
  it("shows the task tracker page and task form", () => {
    cy.visit("/");
    cy.contains("Mini Task Tracker").should("be.visible");
    cy.get('input[name="title"]').should("be.visible");
    cy.get('input[name="dueDate"]').should("be.visible");
    cy.contains("Add task").should("be.visible");
  });

  it("shows the task status filters", () => {
    cy.visit("/");
    cy.contains("button", "All").should("be.visible");
    cy.contains("button", "Pending").should("be.visible");
    cy.contains("button", "Completed").should("be.visible");
  });
});
