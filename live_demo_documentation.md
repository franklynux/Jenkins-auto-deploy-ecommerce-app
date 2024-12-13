# Live Demonstration Documentation

## Introduction

This document outlines the steps to implement changes to the live web application. It serves as a guide for users to follow along with the demo, focusing on pushing changes and observing updates.

## Prerequisites

- Ensure you have the following tools installed:
  - Node.js
  - npm
  - Docker (if applicable)
- Access to the web application repository.
- For Jenkins setup and configuration, please refer to the [README.md](README.md) file.

## Steps to Push Changes and Observe Updates

1. **Login to Jenkins**
    ![Jenkins Login](./images/Jenkins%20login%20page.png)

2. Make a change to your application source code file (app.js)
   - An example would be adding a new service offered by the firm to be displayed on the web application.
   - Navigate to app.js, and a new block to the list of services.

   ![new service added](./images/Live%20demo%20(new%20service%20block).png)

3. **Push Changes to GitHub Repository**
    - After making changes to the application, you can push them to the GitHub repository to trigger the CI/CD pipeline.
    - Open your terminal and navigate to the project directory.
    - Use the following commands to add, commit, and push your changes:

      ```bash
      git add .
      git commit -m "Your commit message"
      git push origin main
      ```

    - ![Push Changes to GitHub Repo (add) & (commit)](./images/Live%20demo%20(git%20add%20&%20commit).png)
    - ![Push Changes to GitHub Repo (push)](./images/Live%20demo%20(git%20push).png)
    - ![Push Changes to GitHub Repo (push)](./images/Live%20demo%20(push%202).png)
    - After pushing the changes, the CI/CD pipeline will be triggered, and the application will be rebuilt

4. **Trigger Jenkins Build**
    - Once the changes are pushed, the GitHub webhook will notify Jenkins to start the build process.

      ![git-webhook trigger](./images/Live%20demo%20(git-webhook).png)

    - You can monitor the build progress in the Jenkins dashboard.
       **Freestyle job triggered with success:**
      ![Jenkins freestyle job triggered](./images/Live%20demo%20(freestyle%20job).png)

      **Pipeline job triggered with success:**
      ![Jenkins pipeline job triggered](./images/Live%20demo%20(pipeline%20job).png)

      ![Jenkins pipeline job triggered](./images/Live%20demo%20(pipeline%20job%202).png)

   - If the build is successful, the changes will be deployed to the production environment.

5. **Access the Updated Web Application**
    - After the build and deployment are complete, access the updated application to see changes at:
      - `http://your-ec2-public-dns:3000/services`:
  
      ![Web App Updated](./images/Live%20demo%20(web%20app%20updated%20with%20new%20service).png)

## Conclusion

This documentation provides a comprehensive guide to implementing changes to the live web application. Follow these steps to ensure a smooth demo experience.
