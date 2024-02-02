interface EmployeeInformation {
    'emp_ID': number,
    'emp_name': String,
    'emp_nickname': String,
    'emp_gender': String,
    'emp_maiden_name': String,
    'emp_sss_fName': String,
    'emp_dob': String,
    'emp_pob': String,
    'emp_cStatus': String,
    'emp_religion': String,
    'emp_blood_type': String,
    'no_of_loads': String,
    'rest_day': String,
    'emp_address': String,
}

interface Certification {
    'cert_ID': number,
    'emp_ID': number,
    'attachment': String,
    'date_issued': number,
    'cert_time': String,
    'cert_title': String,
    'cert_validity': String,
    'cert_type': String,
    'role': String,
    'status': String
}

interface Dependencies {
    'dependencies_ID': number,
    'emp_ID': number,
    'f_name': String,
    'date_of_birth': number,
    'relationship': String,
}

interface Organizations {
    'org_ID': number,
    'emp_ID': number,
    'org_name': String,
    'date': number,
}

interface AccountingDetails {
    'sss_no': number,
    'tax_no': number,
    'pagibig_no': number,
    'philhealth_no': number,
}

interface Education {
    'emp_ID': number,
    'bac_school': String,
    'bac_grad_date': number,
    'mas_school': String,
    'mas_grad_date': number,
    'doc_school': String,
    'doc_grad_date': number,
    'prof_lic': String,
    'lic_ID': number,
}

interface TeachingLoads {
    'teachingloads_ID': number,
    'emp_ID': number,
    'acad_year': String,
    'sem': String,
    'sub_taught': String,
    'no_of_units': number,
}

interface WorkExperience {
    'experience_ID': number,
    'emp_ID': number,
    'company_name': String,
    'date': number,
    'company_add': String,
    'position': String,
    'reason_exit': String,
    'type': String, 
}

interface EmployeeDetails {
    'emp_ID': number,
    'department': String,
    'date_hire': number,
    'emp_type': String,
    'teaching_class': String,
    'status': String,
    'date_regularized': number,
    'time_stamp': number,
}

interface PersonalContact {
    'emp_ID': number,
    'present_add': String,
    'home_phone': number,
    'mobile_phone': number,
    'email_add_1': String,
    'email_add_2': String,
}

interface ProvincialContact {
    'provincial_ID': number,
    'emp_ID': number,
    'provincial_add': String,
    'provincial_phone': String,
}

interface Emergency {
    'emp_ID': number,
    'contact_person': String,
    'relationship': String,
    'home_phone_no': number,
    'mobile_phone_no': number,
}

interface Skills {
    'skills_ID': number,
    'emp_ID': number,
    'skills': String,
}

interface AllEmployees {
    emp_ID: String,
    password: String,
}

export { 
    EmployeeInformation,
    Certification,
    Dependencies,
    Organizations,
    AccountingDetails,
    Education,
    TeachingLoads,
    WorkExperience,
    EmployeeDetails,
    PersonalContact,
    ProvincialContact,
    Emergency,
    Skills,
    AllEmployees
}
