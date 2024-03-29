# Changelog

All notable changes to this project will be documented in this file.
Include any required SharePoint changes that will be needed to deploy you PR
Update the version number in package.json when submitting your PR

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),

## [Unreleased]

- (Keep your changes here until you have a release version)

## [1.0.40] - 2023-05-04

### Fixed

- Normal users were unable to save new Activities

## [1.0.39] - 2023-04-24

### Fixed

- Improper use of react-datepicker package causing ref errors

### Changed

- Prettier formatting applied
- Updated packages
- Updated react-datepicker
- moved dev packages into devDependencies

### Removed

- jQuery

## [1.0.38] - 2022-01-20

### Fixed

- Users cannot be added to the same department/role they already hold
- Correctly display user's department after adding them to a role
- Correctly delete a role entry if it was added and page not refreshed
- Don't allow user to select the same OPR more than once on an Activity
- Don't show cached people in PeoplePicker twice
- Properly clear out PeoplePicker after adding user to a role

### Changed

- Show spinner while role entry is being added

## [1.0.37] - 2022-01-20

### Fixed

- Removed hardcoded SharePoint URL and instead utilize the current hosted Web
- Update Id and SPUserId to be number field types to match what SP provides back
- Added a basic error catch wrapper around adding a new role to fix TS error and catch any SP server errors

## [1.0.36] - 2022-01-10

### Fixed

- Correctly show Active item in NavBar
- Correctly Route to specific role in RoleManagement

## [1.0.35] - 2022-01-07

### Fixed

- Correctly allow multiple OPRs to be saved
- Correctly save activities selected as Previous with Previous Week Of
- Fix to allow the Validation Checks to run properly

## [1.0.34] - 2020-12-02

### Fixed

- Dependency vulnerabilities in package.json

## [1.0.33] - 2020-11-13

### Added

- Better documentation for API and utilities code

## [1.0.32] - 2020-11-03

### Added

- Ability for the user to copy an activity from the home/Activities page

## [1.0.31] - 2020-10-27

### Changed

- Division/Branch Chiefs can now edit items regardless of time frame

## [1.0.30] - 2020-10-26

### Fixed

- Bug that prevented users from editing some activities right after they are created

## [1.0.29] - 2020-10-22

### Added

- Filters for Org, OPR, and keyword search added to the WAR, MAR, and HistoryReport pages

## [1.0.28] - 2020-10-16

### Fixed

- Reviewers now also will have their reviewer role's org(s) as the default org for the Review page filter

## [1.0.27] - 2020-10-16

### Changed

- MAR report page now will only show Activities at their 3 ltr level or higher

## [1.0.26] - 2020-10-14

### Added

- IsHistory and IsMAR fields to the search form on the Review page
- More abstract/generalized PeoplePicker

### Changed

- The showUserOnly field turned into a full OPR PeoplePicker field

## [1.0.25] - 2020-10-09

### Changed

- Navigating to the Review page now uses a date range of 'last week' if the current day is before Wednesday and 'this week' otherwise

## [1.0.24] - 2020-10-08

### Changed

- Navigating to the Review page of Branch Chiefs and Div Chiefs now filters by the Orgs that they are Chiefs for

## [1.0.23] - 2020-09-17

### Changed

- Org list is now fetched using orderBy so they show up sorted in all lists

## [1.0.22] - 2020-06-24

### Changed

- Activities are now fetched using .getPaged() to allow for large datasets to be reported
- Activity page and WAR/MAR/History reports updated to handle paging

## [1.0.21] - 2020-06-24

### Removed

- "Org" field from Activites list has been removed; use "Branch" field

## [1.0.20] - 2020-06-16

### Fixed

- Users can now edit activities that they created without being in the OPRs field
- Branch header accordions will now open/close automatically when a new search fills or empties that Branch's list

## [1.0.19] - 2020-06-15

### Fixed

- OPR people picker now resets the focus back to the input after selectinga persona

## [1.0.18] - 2020-06-12

### Changed

- The Review page now groups the activities by Branch as well as WeekOf

### Fixed

- Bug with MS edge that made the page reload when submitting a search through the search bar or on the Review page

### Added

- A badge in the Branch headers that shows the number of activities in that Branch for that WeekOf

## [1.0.17] - 2020-06-10

### Changed

- Monthly Activity Report formatting updated to match Ms. Eviston's email

## [1.0.16] - 2020-06-09

### Changed

- Big Rocks report is now Monthly Activity Report (MAR)
- Big Rock flag is now MAR Item flag
- Activities list 'isBigRock' replaced by 'isMarEntry'

## [1.0.15] - 2020-06-09

### Changed

- The review page now defaults to showing all users' activities if the current user has a role

## [1.0.14] - 2020-06-08

### Changed

- The date ranges on forms will now show the last day of the week on the ending date of the range
- Moved to using MomentJS for all of the date code as it is easier to manage

### Fixed

- Manually sorted the Review page's weeks because in some specific instances they could get out of order
- Fixed off by one error causing the API to fetch an extra week of data

## [1.0.13] - 2020-06-04

### Fixed

- Editing an activity from the Review page no longer moves the date

## [1.0.12] - 2020-06-02

### Added

- Indicators for TEST builds
- Browser support message

## [1.0.11] - 2020-06-01

### Added

- SP List to keep track of the orgs being used
- Support in app to automatically pull from the Orgs SP List instead of having a list of Orgs hardcoded in

## [1.0.10] - 2020-06-01

### Fixed

- The Review page will now use the URL parameters as the default values of all of the search form arguments

### Changed

- The form now submits with the enter button as well as when the submit button is pressed

## [1.0.9] - 2020-05-29

### Added

- UserPreferences SharePoint list that will be used to keep track of user specific properties
- A DefaultOrg for each user which will be based on the user's last used org/branch when creating activities

### Changed

- The Activity modal shown when creating a new Activity will show the DefaultOrg saved for that user
- Saving a different org/branch when creating a new Activity will update that user's DefaultOrg

## [1.0.8] - 2020-05-28

### Changed

- Review now orders by Branch (alphabetically ascending)

## [1.0.7] - 2020-05-26

### Changed

- Default org for new activities is now blank (displays as '--') instead of OZIC
- Org for activities is now required (can't be blank)

## [1.0.6] - 2020-05-26

### Added

- Message on reports pages to indicate when there are no activities found
- Message on reports pages to indicate when the report has not yet been generated

### Changed

- Each page's header now has better spacing

## [1.0.5] - 2020-05-22

### Fixed

- Whitespace is now preserved on report pages

## [1.0.4] - 2020-05-22

### Added

- Show if an Activity is a Big Rock or History Item on the Review and Activites pages

## [1.0.3] - 2020-05-20

### Fixed

- Activities are now pulled based on if the user is the author or in the OPRs list

## [1.0.2] - 2020-05-19

- Enabled 4 letters in Chief role picker

## [1.0.1] - 2020-05-19

### Changed

- Trim whitespace on saving activity
- Made date formats consistent (MM/DD/YYYY)
- Org logo in left nav now has correct margins and width

### Removed

- Yoda.webp image file :'(

## [1.0.0] - 2020-05-19

- Deployed the application into PROD for the first time

## [0.1.8] - 2020-05-18

### Fixed

- Global search will now search the keyword entered for all entries instead of by the default date range

### Changed

- Search params for the /Review page are now put into the URL params instead of state vars

## [0.1.7] - 2020-05-15

### Added

- COVID19 SVG and link on LeftNav

### Changed

- Made all containers fluid
- Made top nav breakpoint smaller (LG -> MD)
- Moved some links around / general nav changes
- Swapped Yoda img for more appropriate XP-OZ logo
- OPRs list no longer has trailing semi-colon

## [0.1.6] - 2020-05-15

### Added

- Search form on /Review page
- Role enforcement on /Review page that restricts normal users to read-only for other users' entries
- Role enforcement on /Review page that allows reviewers/chiefs to edit other users' entries

### Changed

- The /Review page now sorts and groups by WeekOf and each week has a collapsible header
- Each of the reports now sort by WeekOf

## [0.1.5] - 2020-05-12

### Removed

- Help / FAQs page removed until we have content for them

### Changed

- Contact Us link moved to top nav and tooltip added
- EditActivityModal updated WeekOf control title
- Activites added tooltip

## [0.1.4] - 2020-05-11

### Changed

- AppHeader now shows user profile picture instead of welcome {user.Title}
- UserProvider now provides a Persona for the user

### Removed

- manifest.json - file was being blocked anyway

## [0.1.3] - 2020-05-11

### Added

- Activity Review page for a simpler view to edit Activities
- Search bar in header that brings the user to the Review page and filters their results based on the query string provided
- Navigation option in header - Reports to bring the user to the Review page with no filters

## [0.1.2] - 2020-05-06

### Changed

- Activities now utilize etags; Updating an activity that has since been updated by someone else will now display an error

## [0.1.1] - 2020-05-05

### Changed

- Activities now use 'OPRs' instead of 'TextOPRs' field

### Removed

- Activities list 'TextOPRs' field

## [0.1.0] - 2020-04-27

### Added

- This CHANGELOG file.

### Types of changes

- Added for new features.
- Changed for changes in existing functionality.
- Deprecated for soon-to-be removed features.
- Removed for now removed features.
- Fixed for any bug fixes.
- Security in case of vulnerabilities.
