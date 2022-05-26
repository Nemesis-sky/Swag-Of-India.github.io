   // applying onclick on + label to expand div
// when click on icon which has tag i it will go to FAQ class div and through 
// that p tag which contains all expandable text
      $("i").click( function(){
         $(this).closest(".FAQ").find(".ans-FAQ").fadeToggle();
      // This is for chnage of labal + to -
         $(this).toggleClass('fas fa-plus fas fa-minus')
      }
      )
      