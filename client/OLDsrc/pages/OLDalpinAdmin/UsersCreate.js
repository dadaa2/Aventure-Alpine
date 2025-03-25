import React from 'react'
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function UsersCreate() {

    const initialValues = {
        mail: "", pseudo: "", password: "",firstName: "", lastName: "", street: "", city: "", zipCode: ""
      };
    
      const onSubmit = (data) => {
        axios.post("http://localhost:3002/users/", data).then((response) => {
          /* setListOfUsers(response.data); */
          console.log("This data has been send to the database");
          console.log(response.data);
        });
      };

      const validationSchema = Yup.object().shape({
        mail: Yup.string().email().required(),
        pseudo: Yup.string().min(3).max(20).required(),
        password: Yup.string().min(8).max(30).required(),
        firstName: Yup.string().min(3).max(20).required(),
        lastName: Yup.string().min(3).max(20),
        street: Yup.string().min(3).max(50),
        city: Yup.string().min(3).max(20),
        zipCode: Yup.string().min(3).max(20)
      });

return(

    <div className="mb-4">
          <div className='accordion' id='accordionUsersCreate'>
            <div className='accordion-item'>
              <h2 className="accordion-header">
              <button 
                  class="accordion-button" 
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target="#collapseOne" 
                  aria-expanded="true" 
                  aria-controls="collapseOne">
                  Créer un utilisateur
              </button>
                  
              </h2>
              <div id="collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordionUsersCreate">
                <div class="accordion-body">
                  
                  <Formik 
                    initialValues={ initialValues }
                    onSubmit={ onSubmit }
                    validationSchema={ validationSchema }
                  >
                    <Form className="formContainer">
                      <label> Adresse mail: </label>
                      <ErrorMessage name="mail" component="span" />
                      <Field 
                        id="createUserMailForm"  
                        name="mail" 
                        placeholder="Adresse mail" 
                        type="email"
                      />
                      <label> Pseudo: </label>
                      <ErrorMessage name="pseudo" component="span" />
                      <Field
                        id="createUserPseudoForm" 
                        name="pseudo"
                        placeholder="Pseudo" 
                        type="text"
                      />
                      <ErrorMessage name="password" component="span" />
                      <label> Mot de passe: </label>
                      <Field
                        id="createUserPasswordForm" 
                        name="password"
                        placeholder="Mot de passe" 
                        type="password"
                      />
                      <label> Prénom: </label>
                      <Field
                        id="createUserFirstNameForm" 
                        name="firstName"
                        placeholder="Prénom" 
                        type="text"
                      />
                      <label> Nom: </label>
                      <Field
                        id="createUserLastNameForm" 
                        name="lastName"
                        placeholder="Nom" 
                        type="text"
                      />
                      <label> Rue: </label>
                      <Field
                        id="createUserStreetForm" 
                        name="street"
                        placeholder="Rue" 
                        type="text"
                      />
                      <label> Ville: </label>
                      <Field
                        id="createUserCityForm" 
                        name="city"
                        placeholder="Ville" 
                        type="text"
                      />
                      <label> Code postale: </label>
                      <Field
                        id="createUserZipCodeForm" 
                        name="zipCode"
                        placeholder="Code postal" 
                        type="text"
                      />
                      <button type="submit"> Créer un utilisateur</button>
                    </Form>
                  </Formik>
                </div>
              </div>
            </div>
          </div>  

                
        </div>
    )
}

export default UsersCreate