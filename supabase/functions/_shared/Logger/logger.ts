export default class Logger {

    private static instance: Logger; // ensures that only one instance of itself is created and reused across the application - singleton pattern

    private constructor() 
    {
        // Private constructor prevents instantiation from outside of the class
    }

    public static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
        
    }
    // Helper function to get the caller's location (file path and line number)
    private getCallerLocation(){
        const stack = new Error().stack; //stack trace contains valuable data such as the file path and line numbers of the code involved in the error.
        if(stack)
        {
            const stackLines = stack.split("\n");
            const callerInfo = stackLines[3].trim();
            return callerInfo;
        }
        return "Unknown location ";
    }
    log(message:string)
    {
        const callerLocation = this.getCallerLocation();
        console.log(`[${new Date().toISOString()}] ${callerLocation} - ${message}`);
    }
    warn(message: string) {
        const callerLocation = this.getCallerLocation();
        console.warn(`[WARN] ${callerLocation}: ${message}`);
      }
    
      error(message: string) {
        const callerLocation = this.getCallerLocation();
        console.error(`[ERROR] ${callerLocation}: ${message}`);
      }
    
      info(message: string) {
        const callerLocation = this.getCallerLocation();
        console.info(`[INFO] ${callerLocation}: ${message}`);
      }
}

/**
 * The stack.split("\n") splits the stack trace into lines. The first line represents the error itself, 
 * the second line (stackLines[1]) is the location where getCallerLocation() was called,  ex: [INFO] at Logger.getCallerLocation 
 * and the third line (stackLines[2]) is the location where your log() method is invoked. ex:[INFO] at Logger.info 
 * By using stackLines[3], you capture the location where the log method is called, not the logger itself. ex: [INFO] at createMeme
 */

