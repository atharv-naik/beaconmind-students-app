import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import { ApiContext } from '@/context/ApiContext';
import { Picker } from '@react-native-picker/picker';
import SuccessAnimation from '@/components/SuccessAnimation';
import { router, Redirect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const App = () => {
  const apiContext = useContext(ApiContext);
  if (!apiContext) {
    throw new Error("Profile Setup must be used within an ApiProvider");
  }

  const {
    authUrl,
    token,
    user,
    loading,
    setLoading,
    setIsProfileSetup,
    isProfileSetup,
    setUser,
    isLoggedIn,
  } = apiContext;

  // 🔐 Redirect if profile already setup
  if (!loading && isLoggedIn && user?.profile_setup_complete) {
    return <Redirect href="/(tabs)/home" />;
  }

  const [step, setStep] = useState(0);
  interface University {
    id: string | number;
    name: string;
  }
  
  interface Program {
    id: string | number;
    name: string;
  }

  const [universities, setUniversities] = useState<University[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [tempUser, setTempUser] = useState(user);

  const accentColor = '#9333ea';

  // Validation logic
  const canProceedStep1 = !!selectedUniversity;
  const canProceedStep2 = !!selectedProgram;
  const canSubmit = !!selectedUniversity && !!selectedProgram && rollNumber.trim() !== '';

  useEffect(() => {
    axios
      .get(`${authUrl}universities/`)
      .then((response) => setUniversities(response.data))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (selectedUniversity) {
      axios
        .get(`${authUrl}programs/?uni=${selectedUniversity}`)
        .then((response) => setPrograms(response.data))
        .catch((error) => console.error(error));
    }
  }, [selectedUniversity]);

  const handleSubmit = () => {
    if (!canSubmit) return;

    setLoading(true);
    axios
      .post(
        `${authUrl}profile/setup/`,
        {
          university: selectedUniversity,
          program: selectedProgram,
          roll_number: rollNumber,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      .then(() => {
        axios
        .get(`${authUrl}profile/`, {
          headers: { Authorization: `Token ${token}` },
        })
        .then((res) => {
          setTempUser(res.data);
          // setIsProfileSetup(res.data.profile_setup_complete === true);
          // console.log('Profile setup complete:', res.data, isProfileSetup);
          // router.replace('/(tabs)/home');
        })
        .then(() => {
          setStep(4);
          setLoading(false);
        });
      })
      .catch((error) => {
        console.log('Submission failed:', error);
        setLoading(false);
      });
  };

  const StepProgress = ({ currentStep }: { currentStep: number }) => {
    const steps = ['Welcome', 'University', 'Program', 'Roll No', 'Done'];
  
    return (
      <View style={styles.stepIndicatorWrapper}>
        {steps.map((label, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
  
          return (
            <View key={label} style={styles.stepItem}>
              <View
                style={[
                  styles.stepCircle,
                  isCompleted && styles.stepCompleted,
                  isActive && styles.stepActive,
                ]}
              />
              <Text
                style={[
                  styles.stepLabel,
                  isActive && styles.stepLabelActive,
                ]}
                numberOfLines={1}
              >
                {label}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };  

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <View style={styles.stepContainer}>
            <Image source={require('@/assets/welcome.png')} style={styles.illustration} contentFit="contain" />
            <Text style={styles.title}>Welcome {user?.username}!</Text>
            <Text style={styles.subtitle}>Let's get your academic details set up.</Text>
            <TouchableOpacity style={styles.button} onPress={() => setStep(1)}>
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        );
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Image source={require('@/assets/university.png')} style={styles.illustration} contentFit="contain" />
            <Text style={styles.title}>Select Your University</Text>
            <View style={styles.dropdownWrapper}>
              <Picker
                key={`uni-picker-${step}`}
                selectedValue={selectedUniversity}
                onValueChange={(val) => {
                  setSelectedUniversity(val);
                  setSelectedProgram(''); // reset program
                }}
                style={styles.dropdown}
                dropdownIconColor={accentColor}
              >
                <Picker.Item label="-- Select University --" value="" />
                {universities.map((uni) => (
                  <Picker.Item key={uni.id} label={uni.name} value={uni.id} />
                ))}
              </Picker>
            </View>
            <TouchableOpacity
              style={[styles.button, { opacity: canProceedStep1 ? 1 : 0.5 }]}
              onPress={() => canProceedStep1 && setStep(2)}
              disabled={!canProceedStep1}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContainer}>
            <Image source={require('@/assets/program.png')} style={styles.illustration} contentFit="contain" />
            <Text style={styles.title}>Select Your Program</Text>
            <View style={styles.dropdownWrapper}>
              <Picker
                selectedValue={selectedProgram}
                onValueChange={setSelectedProgram}
                style={styles.dropdown}
                dropdownIconColor={accentColor}
                enabled={!!selectedUniversity}
              >
                <Picker.Item label="-- Select Program --" value="" />
                {programs.map((prog) => (
                  <Picker.Item key={prog.id} label={prog.name} value={prog.id} />
                ))}
              </Picker>
            </View>
            <TouchableOpacity
              style={[styles.button, { opacity: canProceedStep2 ? 1 : 0.5 }]}
              onPress={() => canProceedStep2 && setStep(3)}
              disabled={!canProceedStep2}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        );
      case 3:
        return (
          <KeyboardAwareScrollView
            contentContainerStyle={styles.scrollContainer}
            enableOnAndroid={true}
            keyboardShouldPersistTaps="handled"
            extraScrollHeight={45}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.illustrationWrapper}>
              <Image source={require('@/assets/rollnumber.png')} style={styles.illustration} contentFit="contain" />
            </View>

            <View style={styles.inputBlock}>
              <Text style={styles.title}>Enter Your Roll Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Roll Number"
                value={rollNumber}
                onChangeText={setRollNumber}
              />
              <TouchableOpacity
                style={[styles.button, { opacity: canSubmit && !loading ? 1 : 0.5 }]}
                onPress={handleSubmit}
                disabled={!canSubmit || loading}
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Submit</Text>}
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        );
      case 4:
        return (
          <View style={styles.stepContainer}>
            <SuccessAnimation />
            <Text style={styles.title}>All Set!</Text>
            <Text style={styles.subtitle}>Your academic details have been saved.</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setUser(tempUser);
                setIsProfileSetup(tempUser?.profile_setup_complete === true);
              }}
            >
              <Text style={styles.buttonText}>Go to Home</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StepProgress currentStep={step} />
      {step > 0 && step < 4 && (
        <TouchableOpacity
          style={styles.backIconWrapper}
          onPress={() => setStep((prev) => prev - 1)}
          activeOpacity={0.8}
        >
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      )}
      {renderStepContent()}
    </View>
  );
};

// Same styles as your original code (unchanged)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  illustration: {
    width: '100%',
    height: 250,
    marginBottom: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  illustrationWrapper: {
    marginTop: 30,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  inputBlock: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9333ea',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderColor: '#9333ea',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#9333ea',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  dropdownWrapper: {
    width: '100%',
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  dropdown: {
    height: 50,
    color: '#111827',
    paddingHorizontal: 10,
    fontSize: 16,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    // backgroundColor: '#f3f4f6',
    // paddingVertical: 8,
    padding: 14,
    // borderRadius: 20,
    zIndex: 10,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.1,
    // shadowRadius: 2,
    // elevation: 3,
  },
  backButtonText: {
    color: '#9333ea',
    fontSize: 16,
    fontWeight: '600',
  },
  stepIndicatorWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 10,
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginBottom: 4,
  },
  stepActive: {
    backgroundColor: '#9333ea',
  },
  stepCompleted: {
    backgroundColor: '#9333ea',
    opacity: 0.5,
  },
  stepLabel: {
    fontSize: 10,
    color: '#aaa',
    textAlign: 'center',
  },
  stepLabelActive: {
    color: '#9333ea',
    fontWeight: '600',
  },
  backIconWrapper: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    // elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    zIndex: 10,
  },
    
});

export default App;
