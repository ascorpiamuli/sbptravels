import { View, Image, Text } from 'react-native';
import React from 'react';
import { Tabs } from "expo-router";
import { icons } from "../../constants";

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="items-center justify-center gap-2">
      <Image 
        source={icon}
        resizeMode='contain'
        tintColor={color}
        className="w-6 h-6"
      />
      <Text className={`${focused ? 'font-psemibold' :'font-pregular'} text-xs`}>
        {name}
      </Text>
    </View>
  );
}

const TabsLayout = () => {
  return (
  <>
    <Tabs
      screenOptions={{
        tabBarShowLabel:false
      }}
    >
      <Tabs.Screen
        name='home'
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.home}
              color={color}
              name="Home"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='booking'
        options={{
          title: 'Booking',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.home}
              color={color}
              name="Booking"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='service'
        options={{
          title: 'Services',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.services}
              color={color}
              name="Services"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='contact'
        options={{
          title: 'Contact Us',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.home}
              color={color}
              name="Contact Us"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='about'
        options={{
          title: 'About Us',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.home}
              color={color}
              name="About Us"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.profile}
              color={color}
              name="Profile"
              focused={focused}
            />
          ),
        }}
      />
      
    </Tabs>
  </>
   
  );
}

export default TabsLayout;