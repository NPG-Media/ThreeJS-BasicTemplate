# ThreeJS-BasicTemplate
 A basic template for using ThreeJS


Runing the Development web-page: npm run dev
Runing a Build into "dist": npm run build
Runing a preview of the Dist folder: npm run preview
Deply to the github page: npm run deploy

Github page: https://npg-media.github.io/ThreeJS-BasicTemplate/

To switch what webpage we are building, rename the wanted index.html file to "index.html"

To deploy manually:
- Force the dist folder to be added in the git commit
- Commit the dist folder
- Push the commit as a subtree with the name "build" to avoid overriding the main
- Github page will be updated automatically from this branch


git add dist -f
git commit -m "Building dist to github page"
git subtree push --prefix dist origin build
