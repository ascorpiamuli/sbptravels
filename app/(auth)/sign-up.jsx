import { View,Image, ScrollView, Text, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 
'react-native-safe-area-context';

import { images } from "../../constants";
import FormField from '../../components/FormField';
import CustomButton from "../../components/CustomButton";
import { createUser } from '../../lib/appwrite';
import { Link, router } from 'expo-router';

const SignUp = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    username: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    setIsSubmitting(true);
    try {
      await createUser(form.email, form.password, form.username);
      router.replace('/home')
    } catch (error) {
      console.error('Error creating user:', error);
      Alert.alert('Error','Sign up Failed.please Retry!')
    }
    setIsSubmitting(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center  h-full px-0 my--1">
          <Image source={images.logo} resizeMode='contain' className="w-[85px]  ml-40 h=[15px]"
          />
          <Text className="text-3xl text-white 
          text-semibold mt-0 ml-40 font-semibold">Sign Up </Text>
          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) =>setForm({...form,
              username:e
            })}
            otherStyles="mt-10"
            
          />
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) =>setForm({...form,
              email:e
            })}
            otherStyles="mt-7"
            keyboardType="email-address"
            
          />
           <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) =>setForm({...form,
              password:e
            })}
            otherStyles="mt-7 mb-7 "
            
          />
          
          <CustomButton
           title="Sign In"
           handlePress={submit}
           containerStyles="mt-3"
           isLoading={isSubmitting}
          />
          <View className="justify-center pt-5 
          flex-row gap-2">
            <Text className="text-lg text-gray-100 
            font-pregular">
              Have an Account Already?
            </Text>
            <Link href="/sign-in" className='text-lg font-psemibold text-secondary'>Sign In</Link>
          </View>
              
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
};
export default SignUp;
