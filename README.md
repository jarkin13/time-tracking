# time-tracking

The Consensys Time Tracker is based off a Google Spreadsheet that contains 3 sheets Employees, Time Periods & Projects.

Within the Spreadsheet there is now a fully function menu that allows you to do the following in the Time Period sheet:

* **Add New Time Period**: Create a new start date and end date based off of the previous time period created. Each time period are in two week increments

* **Create Form(s)**: Creates a new form and response spreadsheet for any time period that are missing a form and response spreadsheet

* **Generate Report**: A dialog asks for the response link to generate the missing user report for (either based on the link selected or provided in the text field). select Based on the response spreadsheet link a new sheet in that spreadsheet with a lists of all employee’s slack handles that have not completed. This could either be used to generate a new report or to update an existing report. If the report is the same, an alert message will notify the user. The user will then have the option to easily send users that have not filled out the form a direct slack message notifying the user to fill out their time card.
* **Slack Form Link**: A dialog asks for the form link to send to #priv-consensys-member channel. The dialog will originally ask if its the most recent form created and if user selects “No” - the user will have the ability to manually enter the correct form.
* **Remind Users**: A dialog will ask which form the user wants to use to find the missing employees to send direct messages in slack to notify them that they need to fill out their time card.

Additional features include:
* Restricting the form to only consensys email users.
* Forms restrict users to filling out duplicated responses.
* Allowing users to edit their form response.

Time form data is stored in the ConsenSys Shared Drive, in the "Operations/Project Tracker" Folder. The "Production" folder there holds the live data, whereas the Stag folder holds scripts on sheets that are being used for testing or development.

* Being worked on:
Generating a second report that is a snap shot of where time is being spent by users/project.

