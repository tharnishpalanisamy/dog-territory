backlog 
Model	Purpose
VeterinaryRecord	Completed examinations and medical history
Treatment	Track treatment plans and progress
Vaccination	Track vaccine details and next due dates













Dog Territory — Rescue to Recovery
1. Dog reported
   
   A user reports an injured, abandoned, or distressed street dog.
   
   Report → Dog (if identified)
2. Admin reviews the report
   
   Admin verifies the report and creates a rescue assignment.
   
   WorkAssignment → Volunteer
3. Volunteer accepts and rescues
   
   Volunteer claims the assignment, visits the location and rescues the dog.
4. Dog admitted to a clinic
   
   Volunteer records the clinic admission and updates the rescue assignment.
   
   Dog's status becomes UNDER_TREATMENT or AT_CLINIC.
5. Medical assignment created
   
   A medical assignment is created for the dog, containing the examination requirements and relevant details.
6. Veterinarian claims assignment
   
   An approved veterinarian accepts the medical assignment and examines the dog.
7. Medical records updated
   
   Veterinarian records examination, diagnosis, treatment plan and vaccination details.
8. Treatment and follow-up
   
   Treatment progress is updated. Follow-up examinations and vaccinations are tracked.
9. Recovery and closure
   
   Dog is marked recovered when appropriate. Admin/volunteer can coordinate release, foster care or adoption.