import { FormControl, ValidationErrors } from "@angular/forms";

export class DigimartValidators {

    // whitespace validation
    static notOnlyWhitespace(control : FormControl) : ValidationErrors{

        // if validation check fails, we return validation errors, else if it passes, we return null

        //check if string contains only whitespaces
        if((control.value != null) && (control.value.trim().length <= 1)){

            // invalid, return error object
            return {'notOnlyWhitespace' : true};
        }
        else{
            
            //valid, return null
            return null;
        }


    }
}
