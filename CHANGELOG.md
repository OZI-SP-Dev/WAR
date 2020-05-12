# Changelog
All notable changes to this project will be documented in this file.
Include any required SharePoint changes that will be needed to deploy you PR
Update the version number in package.json when submitting your PR

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),

## [Unreleased]
- (Keep your changes here until you have a release version)

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