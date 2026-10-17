from pydantic import BaseModel,Field,EmailStr



class RegisterData(BaseModel):
    name:str=Field(min_length=5,max_length=50)
    email:EmailStr
    password:str=Field(min_length=8,max_length=50)



class OtpBodyIn(BaseModel):
    email:EmailStr
    otp:str=Field(min_length=6,max_length=6)