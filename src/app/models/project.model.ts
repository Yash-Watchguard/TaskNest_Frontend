export type projectresponse = {
  project_id: string;
  project_name: string;
  project_description: string;
  deadline: string;
  created_by: string;
  assigned_manager_id: string;
};

export type viewprojectresponse = {
  status: string;
  message: string;
  data: projectresponse[];
};

export type Project = {
  ProjectId: string;
  ProjectName: string;
  ProjectDes: string;
  Deadline: Date;
  CreatedBy: string;
  AssignedManagerId: string;
};

export interface AddProjectRequest {
  projectName: string;
  projectDescription: string;
  deadline: string;
  assignedManagerId: string;
}
