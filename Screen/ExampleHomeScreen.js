import React from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import logo from '../assets/BGY_logo.png';
import logo1 from '../assets/icon.png';
import logo2 from '../assets/splash-icon.png';


const ExampleHomeScreen = ({ navigation }) => {
  const handlePrint = async () => {
    try {
      // HTML content for the PDF
      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header {
                text-align: center;
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 10px;
              }
              .logo-container {
                display: flex;
                justify-content: center;
                align-items: center;
              }
              .logo {
                width: 60px;
                height: 60px;
                margin: 5px;
              }
              .details {
                margin-top: 20px;
                text-align: left;
                font-size: 14px;
              }
              .section {
                margin-top: 20px;
              }
              .label {
                font-weight: bold;
              }
              .footer {
                margin-top: 30px;
                font-size: 14px;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo-container">
                <img src="${logo1}" class="logo" />
                <img src="${logo}" class="logo" />
                <img src="${logo2}" class="logo" />
              </div>
              <p>
                REPUBLIC OF THE PHILIPPINES<br />
                PROVINCE OF CAMARINES NORTE<br />
                MUNICIPALITY OF DAET<br />
                <b>BARANGAY III</b>
              </p>
              <p><b>OFFICE OF THE LUPONG TAGAPAMAYAPA</b></p>
            </div>

            <div class="details">
              <p>Complainant/s: _________________________</p>
              <p>Respondent/s: _________________________</p>
              <p>Barangay Case No.: ____________________</p>
            </div>

            <div class="section">
              <p class="label">SUMMONS</p>
              <p>
                To: _________________________ <br />
                You are hereby summoned to appear before me in person, together
                with your witnesses, on the ___ day of __________, 20___, at
                ___ o'clock in the morning/afternoon, then and there to answer
                to a complaint made before me.
              </p>
              <p>
                You are hereby warned that if you refuse or willfully fail to
                appear in obedience to this summons, you may be barred from
                filing any counterclaim arising from said complaint.
              </p>
            </div>

            <div class="footer">
              <p>______________________</p>
              <p>HON. MARIO D. ELLADO<br />Barangay Chairman/Lupon Chairman</p>
            </div>
          </body>
        </html>
      `;

      // Generate the PDF
      const { uri } = await Print.printToFileAsync({ html: htmlContent, width: 595,
        height: 842, });

      // Save the file to the document directory
      const filePath = `${FileSystem.documentDirectory}Summons.pdf`;
      await FileSystem.moveAsync({ from: uri, to: filePath });

      // Share or notify the user of the saved file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath);
      } else {
        Alert.alert("PDF Generated", `PDF saved to: ${filePath}`);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to generate or save the PDF.");
      console.error(error);
    }
  };

  const handlePrint1 = async () => {
    try {
      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header {
                text-align: center;
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 10px;
              }
              .details {
                margin-top: 20px;
                text-align: left;
                font-size: 14px;
              }
              .footer {
                margin-top: 30px;
                font-size: 14px;
                text-align: left;
              }
              .header-new {
                margin-top: 30px;
                font-size: 14px;
                text-align: left;
                font-weight: bold'
              }
            </style>
          </head>
          <body>
            <div class="header-new">
              <strong>
              [Your Position or Barangay Address]<br />
              [City/Municipality, Province]<br />
              [Date]<br /> <br />
              The Honorable [Name of Judge or Court Head]<br />
              [Court Name]<br />
              [Court Address]<br />
              </strong>
            </div>
  
            <div class="details">
              <p><strong>Subject:</strong> Request for Elevation of Case Report No. INC-2024001 to Court</p>
              <p>Dear Honorable [Judge's Name],</p>
              <p>I am writing to formally request the elevation of Case Report No. INC-2024001, recorded on [Incident Date], to your honorable court for further legal proceedings. This case, filed by [Name of Complainant], pertains to an incident that occurred at [Place of Incident], and the initial investigation and mediation efforts conducted at the barangay level have not resulted in resolution.</p>
              <p>Details regarding the nature of the incident, the parties involved, and other relevant information have been documented and are enclosed with this letter. To ensure justice and provide a fair hearing for both parties, we believe it is imperative that the matter be addressed under the jurisdiction of the court.</p>
              <p>Attached to this letter are copies of the following documents for your reference:</p>
              <ul>
                <li>Case Report No. INC-2024001</li>
                <li>Complainant’s statement and contact information</li>
                <li>Respondent’s information (if available)</li>
                <li>Supporting evidence, including descriptions, photos/videos, or other pertinent details</li>
              </ul>
              <p>We trust that this honorable court will give the case the attention it requires. Please do not hesitate to contact us at [Barangay Contact Information] for any clarifications or additional information needed.</p>
              <p>We greatly appreciate your attention and assistance in this matter.</p>
            </div>
  
            <div class="footer">
              Sincerely,<br />
              [Your Name]<br />
              [Your Position]<br />
              [Barangay Contact Information]
            </div>
          </body>
        </html>
      `;
  
      const { uri } = await Print.printToFileAsync({ html: htmlContent, width: 595,
        height: 842 });
  
      const filePath = `${FileSystem.documentDirectory}Request.pdf`;
      await FileSystem.moveAsync({ from: uri, to: filePath });
  
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath);
      } else {
        Alert.alert("PDF Generated", `PDF saved to: ${filePath}`);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to generate or save the PDF.");
      console.error(error);
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title="CaseList"
          onPress={() => navigation.navigate("CaseList")}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="CaseReport"
          onPress={() => navigation.navigate("CaseReport")}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Print Summon" onPress={handlePrint} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Print Request" onPress={handlePrint1}/>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Blotter List"
          onPress={() => navigation.navigate("BlotterList")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    display: "flex",
  },
  buttonContainer: {
    width: "100%",
    height: "10%",
    marginBottom: 10,
    justifyContent: "center",
    display: "flex",
  },
});

export default ExampleHomeScreen;
