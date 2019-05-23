//OOP of a simple comment section. Uses inheritance and JS ES6

class User {
    constructor(name) {
      this._name = name;
      this._isLoggedIn = false;
      this._lastLoggedInAt = null;
      this._comments = [];
    }
    createComment(comment){
      this._comments.push(new Comment(
        comment._author,
        comment._message,
        comment._repliedTo
      ));
    }
    isLoggedIn() {
      return this._isLoggedIn;
    }
    getLastLoggedInAt() {
      return this._lastLoggedInAt;
    }
    logIn() {
      this._isLoggedIn = true;
      this._lastLoggedInAt = new Date();
    }
    logOut() {
      this._isLoggedIn = false
    }
    getName() {
      return this._name;
    }
    setName(name) {
      this._name = name;
    }
    canEdit(comment) {
      if( this instanceof Admin){
        return true;
      }else if(this._comments.length === 0 && this.getName() === comment.getAuthor().getName()){
          this.createComment(comment);
        }
        return this._comments.filter((c, index) => {
          if(this.getName() === comment.getAuthor().getName()){
            this._comments[index] = comment;
            return true;
          }else{
            return false;
          } 
        }).length > 0;
        
      }
    
    canDelete(comment) {
      if(this instanceof Moderator){
        return true
      }else {
        return false
      }
    }
  }
  
  class Moderator extends User{
    constructor(name){
      super(name);
    }
  }
  
  class Admin extends Moderator {
    constructor(name){
      super(name);
    }
  }
  
  class Comment {
    constructor(author, message, repliedTo) {
      this._author = author;
      this._message = message;
      this._repliedTo = repliedTo || null;
      this._createdAt = new Date();
    }
    getMessage() {
      return this._message;
    }
    setMessage(message) {
      this._message = message;
    }
    getCreatedAt() {
      return this._createdAt;
    }
    getAuthor() {
      return this._author;
    }
    getRepliedTo() {
      return this._repliedTo;
    }
    toString() {
      return this.getRepliedTo()?
        this.getMessage() + " by " + this.getAuthor().getName() + " (replied to " + this.getRepliedTo().getAuthor().getName() + ")":
        this.getMessage() + " by " + this.getAuthor().getName();
    }
  }