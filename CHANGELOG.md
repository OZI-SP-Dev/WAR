# Changelog
All notable changes to this project will be documented in this file.
Include any required SharePoint changes that will be needed to deploy you PR
Update the version number in package.json when submitting your PR

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),

## [Unreleased]
- (Keep your changes here until you have a release version)

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