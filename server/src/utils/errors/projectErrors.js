class ProjectTitleNotProvided extends Error {
  constructor() {
    super("Project title not provided");
    this.statusCode = 400;
  }
}

class ProjectDescriptionNotProvided extends Error {
  constructor() {
    super("Project description not provided");
    this.statusCode = 400;
  }
}

class ProjectNotFound extends Error {
  constructor() {
    super("Project not found");
    this.statusCode = 404;
  }
}

class ProjectDataMissing extends Error {
  constructor() {
    super("Project data is missing");
    this.statusCode = 400;
  }
}

export {
  ProjectTitleNotProvided,
  ProjectDescriptionNotProvided,
  ProjectNotFound,
  ProjectDataMissing,
};
