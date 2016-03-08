import Ember from 'ember';

export default Ember.Controller.extend({
  inputValue:1,
  actions:{

    onWheel(e){
      //TODO: why this needs to be placed but not the mouseUp and Down events?
    },
    onChanged(value, touchSpin){
      console.log(touchSpin);
      this.set('inputValue',value);
    }
  }
});
