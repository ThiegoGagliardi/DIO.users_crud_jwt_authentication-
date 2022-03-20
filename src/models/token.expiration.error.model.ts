export default class tokenExpirationError extends Error{
    constructor(
        public message :  string,
        public error?: any,
    ) {super(message)}    
};