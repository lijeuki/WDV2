# Role Glossary & Terminology Mapping

This glossary aligns role names used across documentation and code with the current five-key-role model, including common synonyms.

Primary Roles
- Doctor → sometimes referred to as Dentist in clinical docs
- Front Desk → Receptionist (synonym in some docs)
- Clinic PIC (Person In Charge) → Clinic Owner (code/document synonym)
- Branch Owner → Branch Manager/Owner
- Super Admin → Enterprise Owner

Optional/Supportive Role
- Treatment Coordinator (TC) → Patient communication & acceptance; operates under Clinic PIC oversight

Code Role Identifiers (UserRole)
- "doctor"
- "front-desk"
- "treatment-coordinator" (optional)
- "owner" → treated as Clinic Owner (Clinic PIC) in this demo
- "branch-owner"
- "clinic-owner"

Notes
- In code samples and some documents, "owner" is used to refer to the Clinic Owner. For consistency in business language, this documentation uses "Clinic PIC (Person In Charge)" to describe the same role at the clinic level.
- "Receptionist" is the same operational role as "Front Desk" in this system.
- "Dentist" is synonymous with "Doctor" for clinical workflows.
- Some legacy documents mention hygienist/assistant/cashier roles. These are compatible but are not part of the five key roles emphasized here.

See Also
- ROLE_BASED_SYSTEM.md — Detailed responsibilities, dashboards, and visual indicators
- ROLE_PERMISSIONS_MATRIX.md — Concise permissions and responsibilities matrix
- NAVIGATION_STRUCTURE.md — Sidebar and patient-context navigation behaviors per role