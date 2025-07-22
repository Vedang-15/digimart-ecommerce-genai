// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  digimartApiUrl : "https://localhost:8443/api",
  stripePublishableKey: "pk_test_51PbkcBRrJwFidErKzzlPLdV3yBYhQwvYSwIxApMIRQ9pFEAIn0Cfk7n54fzM77H7dpTgaynSQPz8s5VSxsycnyO800SPdu6VRz"
};







// Actual flow of application (Ho can we run our code on differnt environments without manually changing th url corresponding to the different backend server environments)

/* Uptil now, we had the hardcoded url for making calls to spring boot backend api in our service classes (like "https://localhost://8080/api/something").This was fine as we were runnign our app in development enviroinment only. But in real world, our app is usually run in various environments before release to public. Environments like :
1. DEV environment : eg - "https://localhost:8443/....."
2. Quality Assurance environment(QA) : eg - "https://qa.myapp.mycompany.com:9898/..." or "https://localhost:9898/.....", ie it can even be a localhost(ie ee can use localhost for qa environment also but the if both development and qa are running on localhost, their port numbers must be different, port is the key thing.)
3. PROD nvironment(production) : eg - "https://myapp.mycompany.com:443/..."

Each of this environment signify a different server, a different port (for backend. Frontend runs on the same port for all environments, ie port 4200) Now whil our backend is runnign on thiese differnt servers/environments, we cant every time go an manually change the urls in servic class that call the backend server api(each environment will hav a different servr, hence different port and different url). Thus we make use of environment files providwd by angular.

Inside these files we define a variable ans assign it to an url corresponding to the environment to which the file belongs(like environment.ts file is for dvelopment environment , environment.prod.ts file is for production , environment.qa.ts for qa environment etc.), and then use that declared in our project. Also while running, along with npm start, we also specify the environment so that our app starts running in the specified environment. Important - Note that the name of the vairable the represents the url must remain same across all environment files. This is the same name that ill b used in our code. Based on the environment in which we are running our application, the defined common url name will take the value defined in that particular environment file(ie file corrsponding to the environmnt in which we are running our app). For eg, will defin digimartApiUrl as the variable in all environment files and assign different urls to it based on the environment files. And we will use this single name(digimartApiUr) in all of our app code for url. hen we wish to run, will spcify the environment alongwith npm start. Then digimartApiUr will take the value defined in that particular environment file(the file corresponding to the environment which will declared with npkm start, ie the environment in which we aree runniogn th app) and accordingly our app code will reflect that particular url(as e are using digimartApiUrl variable in our app and no digimartApiUrl has the url declared in the environment file hich corresponds to the environment in which we are runnig our app). Thus, this will ensure that by declared a single variable in our code(digimartApiUrl), we can run our app in differnt environmnts ithout the need to change the url or ven variable namein our code. Once we perpare our code and add all environment files, we dont need to make any change to our code. We can run it on any environment just by specifying the namr of rnvironment with npm start, and the suitabls url(rt the environment in which we wish to run our app) wil be automatically used in our app. We wont need to make any changes to our code then.
*/
