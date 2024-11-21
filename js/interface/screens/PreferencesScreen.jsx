import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { Button, Surface } from "react-native-paper";
import { Alert, ScrollView } from "react-native";
import Styles from "../styles";
import * as Types from "../../types";
import * as ApplicationThemes from "../themes";
import { ControllerButtons } from "../../lib/controller";
import { PreferencesActions } from "../../redux";
import { PreferenceInputCard, PreferencePickCard } from "../components";

class PreferencesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      preferencesKey: Date.now(),
    };
  }

  validateAnalogDeadZone = (value) =>
    /^\d+$/.test(value) && Number(value) >= 0 && Number(value) <= 99;

  validateAnalogStickMax = (value) =>
    /^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 32767;

  validateSocketMinLatency = (value) =>
    /^\d+$/.test(value) && Number(value) >= 0 && Number(value) <= 1000;

  confirmResetPreferences = () => {
    const { resetPreferences } = this.props;
    Alert.alert(
      "Resetting preferences",
      "Confirm resetting preferences to default values?",
      [
        {
          text: "CONFIRM",
          onPress: () => {
            resetPreferences();
            this.setState({ preferencesKey: Date.now() });
          },
        },
        {
          text: "CANCEL",
          style: "cancel",
        },
      ],
      { cancelable: false },
    );
  };

  render() {
    const {
      applicationTheme,
      controllerButtons,
      analogDeadZone,
      analogStickMax,
      socketMinLatency,
      saveApplicationTheme,
      saveControllerButtons,
      saveAnalogDeadZone,
      saveAnalogStickMax,
      saveSocketMinLatency,
    } = this.props;
    const { preferencesKey } = this.state;
    return (
      <Surface style={Styles.screen}>
        <ScrollView key={preferencesKey} overScrollMode="never">
          <PreferencePickCard
            name="Application theme"
            helperText="Change application appearance"
            value={applicationTheme}
            options={_.values(ApplicationThemes)}
            onPick={(value) => saveApplicationTheme(value)}
          />
          <PreferencePickCard
            name="Controller Buttons"
            helperText="Change buttons appearance"
            value={controllerButtons}
            options={_.values(ControllerButtons)}
            onPick={(value) => saveControllerButtons(value)}
          />
          <PreferenceInputCard
            name="Analog dead zone"
            helperText="Valid values: 0 - 99 (%)"
            value={String(analogDeadZone)}
            onValidate={this.validateAnalogDeadZone}
            onSubmit={(value) => saveAnalogDeadZone(Number(value))}
          />
          <PreferenceInputCard
            name="Analog stick range"
            helperText="Valid values: 1 - 32767 (px)"
            value={String(analogStickMax)}
            onValidate={this.validateAnalogStickMax}
            onSubmit={(value) => saveAnalogStickMax(Number(value))}
          />
          <PreferenceInputCard
            name="Socket minimum latency"
            helperText="Valid values: 0 - 1000 (ms)"
            value={String(socketMinLatency)}
            onValidate={this.validateSocketMinLatency}
            onSubmit={(value) => saveSocketMinLatency(Number(value))}
          />
        </ScrollView>
        <Button
          mode="outlined"
          color="crimson"
          style={Styles.elevate}
          onPress={this.confirmResetPreferences}
        >
          RESET
        </Button>
      </Surface>
    );
  }
}

PreferencesScreen.propTypes = {
  applicationTheme: Types.applicationTheme.isRequired,
  controllerButtons: Types.controllerButtons.isRequired,
  analogDeadZone: Types.number.isRequired,
  analogStickMax: Types.number.isRequired,
  socketMinLatency: Types.number.isRequired,
  saveApplicationTheme: Types.func.isRequired,
  saveControllerButtons: Types.func.isRequired,
  saveAnalogDeadZone: Types.func.isRequired,
  saveAnalogStickMax: Types.func.isRequired,
  saveSocketMinLatency: Types.func.isRequired,
  resetPreferences: Types.func.isRequired,
};

const mapStateToProps = (state) => ({
  applicationTheme: state.preferences.applicationTheme,
  controllerButtons: state.preferences.controllerButtons,
  analogDeadZone: state.preferences.analogDeadZone,
  analogStickMax: state.preferences.analogStickMax,
  socketMinLatency: state.preferences.socketMinLatency,
});

const mapDispatchToProps = {
  saveApplicationTheme: PreferencesActions.setApplicationTheme,
  saveControllerButtons: PreferencesActions.setControllerButtons,
  saveAnalogDeadZone: PreferencesActions.setAnalogDeadZone,
  saveAnalogStickMax: PreferencesActions.setAnalogStickMax,
  saveSocketMinLatency: PreferencesActions.setSocketMinLatency,
  resetPreferences: PreferencesActions.setDefaults,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PreferencesScreen);
