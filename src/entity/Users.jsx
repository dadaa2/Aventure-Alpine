class Users {
    constructor(
        id, 
        pseudo, 
        firstName, 
        lastName, 
        street, 
        zipCode, 
        city, 
        inscriptionDate) {
      this.id = id;
      this.pseudo = pseudo;
      this.firstName = firstName;
      this.lastName = lastName;
      this.street = street;
      this.zipCode = zipCode;
      this.city = city;
      this.inscriptionDate = inscriptionDate;
    }

    // Getters
    getId() {
      return this.id;
    }
    getPseudo() {
      return this.pseudo;
    }
    getFirstName() {
      return this.firstName;
    }
    getLastName() {
      return this.lastName;
    }
    getStreet() {
      return this.street;
    }
    getZipCode() {
      return this.zipCode;
    }
    getCity() {
      return this.city;
    }
    getInscriptionDate() {
      return this.inscriptionDate;
    }

    // Setters 
    setId(id) {
      this.id = id;
    }
    setPseudo(pseudo) {
      this.pseudo = pseudo;
    }
    setFirstName(firstName) {
      this.firstName = firstName;
    }
    setLastName(lastName) {
      this.lastName = lastName;
    }
    setStreet(street) {
      this.street = street;
    }
    setZipCode(zipCode) {
      this.zipCode = zipCode;
    }
    setCity(city) {
      this.city = city;
    }
    setInscriptionDate(inscriptionDate) {
      this.inscriptionDate = inscriptionDate;
    }
  }
  
  export default Users;