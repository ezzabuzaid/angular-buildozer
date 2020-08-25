# Angular Buildozer, A Production-ready Angular boilerplate

A better document will be available soon, with inclusive demonstrations about the folder structure and what you need to kick things off

## Prolog

    A simple yet efficient repository that aims to focus on writing the business logic directly without think of other concerns like structuring and architecting the application from codebase point of view.
    
    the repo contains what you need to go ahead with a project and to seamlessly updated later on from caching to spinner, it's built on top of latest angular versions

    No hard change on webpack or anything that will make you learn another thing just to understand why it's written like this, it's totally pure Angular way.

    The code was decoupled to several library for now and still in progress be more decoupled so you can use things on demand 

## Getting Started

1. Clone the project.
2. Run `node setup [project-name] [project-title]` .
3. Remove anything other than `[portal, static]` from `src/app/pages` .
4. Remove `[services, models]` from `src/app/shared` .
5. Clear out API/Routing constants.
6. Free up the assets if needed.

## Folder Structure

* @Pages

    Any module that will be complete page and not part of another page

* @Partials

    Imagine that you have **Orders** and **Products** pages and there's the component that's shared between them and of course you don't want to duplicate the code here and there, so as the guides tell we should use the same component for both domains, hence, we need to configure it to adapt different places with respect to single responsibility principle and remember the code should be agonistic.
    for that, you need to use input and output functionality offered by the framework to communicate with the host.
    now, we know that the component is related to **orders** and we need to use it in other domain, therefore, we need another folder to make things consistent and easy to reach, here where it came the idea of **partial** module/components that can be used across the pages. so the things within the partials are strictly related to a domain and not just reusable component like **MainButton**

* @Widget

    A Container of reusable widgets that is not directly related to a domain
    e.g: **stepper** module aka Wizard Form is set of blocks used to navigate in one direction, it's could be part of the requirements but not essentially related to any domain.
    When you want to make **order-stepper** that related to **Orders** domain you need to move it to  **`Partials`** folder because  it's a critical part of the application

* @Core: in progress
* @Shared: in progress

## What's inside

* Widgets

<!-- 1. resizable: An easy way to make any block horizontally resizable -->

1. sidebar: Customized sidebar with a variety of options including horizontal resizing
2. scroll-detection: Module that can observer the scrolling in both vertical directions
3. infinity-scroll: Infinite Scroll module that can be used to 

## Deprecation

* Widget/gmap is no longer maintained, I'll keep it as reference
* Widget/dialog is no longer maintained, you can use it to create custom dialog

## Summary

1. I'll highly suggest following [Angular](https://angular.io/guide/creating-libraries#refactoring-parts-of-an-app-into-a-library) way.

think of your reusable component or module as a library that the host should adhere to it.

## Contributing

Don’t hesitate to open issues and make a pull request to help improve code

1.  Fork it!
2.  Create your feature branch: `git checkout -b my-new-feature`
3.  Commit your changes: `git commit -m 'Add some feature'`
4.  Push to the branch: `git push origin my-new-feature`
5.  Submit a pull request :D

## Versioning

The project will be maintained under the semantic versioning guidelines.  
Releases will be numbered with the following format:  
 `<major>.<minor>.<patch>`
For more information on SemVer, please visit [http://semver.org](http://semver.org).

## Developer

##### [Ezzabuzaid](mailto:ezzabuzaid@hotmail.com)

*   [Dev.to](https://dev.to/ezzabuzaid)
*   [GitHub](https://github.com/ezzabuzaid)
*   [Linkedin](https://www.linkedin.com/in/ezzabuzaid)

## Maintainers

[**ezzabuzaid**](https://github.com/ezzabuzaid) - (author) - [ezzabuzaid@hotmail.com](mailto:ezzabuzaid@hotmail.com)

## License

##### The MIT License (MIT)

## help is welcomed

### Don’t heistate to try it

After cloning the project run `npm install && ng serve -o`

##### Built with love <3
