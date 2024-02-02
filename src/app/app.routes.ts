import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { InfoComponent } from './info/info.component';
import { DependenciesComponent } from './dependencies/dependencies.component';
import { CertificationComponent } from './certification/certification.component';
import { OrganizationComponent } from './organization/organization.component';
import { AccountingdetailsComponent } from './accountingdetails/accountingdetails.component';
import { EducationComponent } from './education/education.component';
import { TeachingloadsComponent } from './teachingloads/teachingloads.component';
import { WorkexperienceComponent } from './workexperience/workexperience.component';
import { EmployeedetailsComponent } from './employeedetails/employeedetails.component';
import { PersonalcontactComponent } from './contact/personalcontact/personalcontact.component';
import { ProvincialcontactComponent } from './contact/provincialcontact/provincialcontact.component';
import { EmergencyComponent } from './contact/emergency/emergency.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { SkillsComponent } from './skills/skills.component';
import { EditInformation } from './info/edit-info/edit-info.component';
import { EditAccountingdetailsComponent } from './accountingdetails/edit-accountingdetails/edit-accountingdetails.component';
import { EditEducationComponent } from './education/edit-education/edit-education.component';
import { EditEmployeedetailsComponent } from './employeedetails/edit-employeedetails/edit-employeedetails.component';
import { EditPersonalcontactComponent } from './contact/personalcontact/edit-personalcontact/edit-personalcontact.component';
import { EditEmergencyComponent } from './contact/emergency/edit-emergency/edit-emergency.component';
import { EditDependenciesComponent } from './dependencies/edit-dependencies/edit-dependencies.component';
import { EditOrganizationComponent } from './organization/edit-organization/edit-organization.component';
import { EditTeachingloadsComponent } from './teachingloads/edit-teachingloads/edit-teachingloads.component';
import { EditProvincialcontactComponent } from './contact/provincialcontact/edit-provincialcontact/edit-provincialcontact.component';
import { EditWorkexperienceComponent } from './workexperience/edit-workexperience/edit-workexperience.component';
import { EditSkillsComponent } from './skills/edit-skills/edit-skills.component';
import { EditCertificationComponent } from './certification/edit-certification/edit-certification.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'admin-login', component: AdminLoginComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {
        path: 'home', component: HomeComponent,
        children: [
            { path: '', redirectTo: 'employeeinformation', pathMatch: 'full' },

            { path: 'employeeinformation', component: InfoComponent, },
            { path: 'employeeinformation/edit-information', component: EditInformation },

            { path: 'dependencies', component: DependenciesComponent },
            { path: 'dependencies/edit-dependencies', component: EditDependenciesComponent },

            { path: 'certification', component: CertificationComponent },
            { path: 'certification/edit-certification', component: EditCertificationComponent },

            { path: 'organization', component: OrganizationComponent },
            { path: 'organization/edit-organization', component: EditOrganizationComponent },

            { path: 'accountingdetails', component: AccountingdetailsComponent },
            { path: 'accountingdetails/edit-accountingdetails', component: EditAccountingdetailsComponent },

            { path: 'education', component: EducationComponent },
            { path: 'education/edit-education', component: EditEducationComponent },

            { path: 'teachingloads', component: TeachingloadsComponent },
            { path: 'teachingloads/edit-teachingloads', component: EditTeachingloadsComponent },

            { path: 'workexperience', component: WorkexperienceComponent },
            { path: 'workexperience/edit-workexperience', component: EditWorkexperienceComponent },

            { path: 'employeedetails', component: EmployeedetailsComponent },
            { path: 'employeedetails/edit-employeedetails', component: EditEmployeedetailsComponent },

            { path: 'skills', component: SkillsComponent },
            { path: 'skills/edit-skills', component: EditSkillsComponent },

            { path: 'personalcontact', component: PersonalcontactComponent },
            { path: 'personalcontact/edit-personalcontact', component: EditPersonalcontactComponent },

            { path: 'provincialcontact', component: ProvincialcontactComponent },
            { path: 'provincialcontact/edit-provincialcontact', component: EditProvincialcontactComponent },

            { path: 'emergencycontact', component: EmergencyComponent },
            { path: 'emergencycontact/edit-emergencycontact', component: EditEmergencyComponent },
        ]
    },
];
