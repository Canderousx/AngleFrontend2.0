import {AbstractControl} from "@angular/forms";


export function ageValidator(control: AbstractControl): {[key:string]:any} | null{
  if(!control.value){
    return null;
  }

  const today = new Date();
  const birthDate = new Date(control.value);
  let age = today.getFullYear() - birthDate.getFullYear();
  const months = today.getMonth() - birthDate.getMonth();
  if(months < 0 || (months === 0 && today.getDate() < birthDate.getDate())){
    age--;
  }
  console.log("AGE: "+age);
  if(age >= 13){
    return null;
  }
  return {"tooYoung": {value: age}}
}
