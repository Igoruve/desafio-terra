
class issueTypeNotProvided extends Error {
    constructor() {
        super("Issue type not provided");
        this.statusCode = 400;
    }
}

class deviceNotProvided extends Error {
    constructor() {
        super("Device not provided");
        this.statusCode = 400;
    }
}

class browserNotProvided extends Error {
    constructor() {
        super("Browser not provided");
        this.statusCode = 400;
    }
}

class clientCommentNotProvided extends Error {
    constructor() {
        super("Client comment not provided");
        this.statusCode = 400;
    }
}

class pageUrlNotProvided extends Error {
    constructor() {
        super("Page URL not provided");
        this.statusCode = 400;
    }
}

export { 
    issueTypeNotProvided, 
    deviceNotProvided,
    browserNotProvided,
    clientCommentNotProvided,
    pageUrlNotProvided
};