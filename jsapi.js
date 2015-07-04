
/** Interface with a projects issues from this class */
class ProjectIssues {
  /** Returns the ordered iterable of all the status headings used in this project */
  get statusHeadings() {}
  /** An iterable of all the swim lanes in the project */
  get swimLanes() {}
}

class SwimLane {
  /** Title of the swim lane */
  get title() {}
  /** Iterable of all the tasks under this swim lane with the specified status */
  get issuesWithStatus(status) {}
}

class Issue {
  get title() {}
  get assignee() {}
  get bodyHtml() {}
}
