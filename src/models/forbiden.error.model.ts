
export default class forbidenError extends Error{
    constructor(
        public message :  string,
        public error?: any,
    ) {super(message)}    
};