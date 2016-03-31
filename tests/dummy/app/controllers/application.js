import Ember from 'ember';

export default Ember.Controller.extend({
  inputValue:1,
  actions:{
    onChanged(value, touchSpin){
      console.log(touchSpin);
      this.set('inputValue',value);
    }
  }
});
