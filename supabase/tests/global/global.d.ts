//   // global.d.ts
//   export {};
//   declare global {
//     type Logger = {
//       getInstance: () => {
//         log: (message: string) => void;
//         info: (message: string) => void;
//         error: (message: string) => void;
//       };
//     };
  
//     type contentTypeValidations = (contentType: string) => boolean;
  
//     type ErrorResponse = (status: number, message: string) => Response;
  
//     type validateMemeData = () => Promise<boolean>;
  
//     type uploadFileToBucket = () => Promise<string>;
  
//     type createMemeQuery = () => Promise<{ data: { id: number }; error: any }>;
  
//     type SuccessResponse = (
//       status: number,
//       message: string,
//       data: any
//     ) => Response;
//   }