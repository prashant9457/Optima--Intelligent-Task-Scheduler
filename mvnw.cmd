@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to you under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    https://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Apache Maven Wrapper startup batch script, version 3.2.0
@REM ----------------------------------------------------------------------------

@IF "%__MVNW_ARG0_NAME__%"=="" (SET __MVNW_ARG0_NAME__=%~nx0)
@SET __MVNW_CMD__=
@SET __MVNW_ERROR__=
@SET __MVNW_SAVE_ERRORLEVEL__=
@SET __MVNW_SAVE_ERRORLEVEL__=%ERRORLEVEL%

@REM Find the project base dir, i.e. the directory that contains the folder ".mvn".
@REM Fallback to current directory if not found.

SET __MVNW_PROJECT_BASEDIR__=%~dp0
:findBaseDir
IF EXIST "%__MVNW_PROJECT_BASEDIR__%\.mvn" goto baseDirFound
SET "__MVNW_PROJECT_BASEDIR__%=%__MVNW_PROJECT_BASEDIR__%\.."
goto findBaseDir
:baseDirFound
SET __MVNW_PROJECT_BASEDIR__=%__MVNW_PROJECT_BASEDIR__%

@REM Set the path to the Maven wrapper properties file
SET __MVNW_WRAPPER_PROPERTIES__=%__MVNW_PROJECT_BASEDIR__%\.mvn\wrapper\maven-wrapper.properties

@REM Find the distribution URL
FOR /F "usebackq tokens=1,* delims==" %%A IN ("%__MVNW_WRAPPER_PROPERTIES__%") DO (
    IF "%%A"=="distributionUrl" SET MVNW_REPOURL=%%B
)

@REM Set the path to the Maven home directory
SET __MVNW_USER_HOME__=%USERPROFILE%
IF NOT "%MAVEN_USER_HOME%"=="" SET __MVNW_USER_HOME__=%MAVEN_USER_HOME%
SET __MVNW_MAVEN_HOME__=%__MVNW_USER_HOME__%\.m2\wrapper\dists

@REM Find the Maven executable
SET __MVNW_MVN_CMD__=%MAVEN_HOME%\bin\mvn.cmd
IF NOT EXIST "%__MVNW_MVN_CMD__%" SET __MVNW_MVN_CMD__=%MAVEN_HOME%\bin\mvn
IF NOT EXIST "%__MVNW_MVN_CMD__%" (
    @REM Try to find mvn in PATH
    FOR %%X IN (mvn.cmd mvn) DO (
        IF NOT "%__MVNW_MVN_CMD__%"=="" GOTO mvnFound
        SET __MVNW_MVN_CMD__=%%~$PATH:X
    )
)
:mvnFound

@REM Run Maven Wrapper
java -cp "%__MVNW_PROJECT_BASEDIR__%\.mvn\wrapper\maven-wrapper.jar" "-Dmaven.multiModuleProjectDirectory=%__MVNW_PROJECT_BASEDIR__%" org.apache.maven.wrapper.MavenWrapperMain %*
