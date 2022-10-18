import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, StatusBar } from 'react-native'
import GeneralField from '../../../src/components/fields/GeneralField'
import PrimaryButton from '../../components/buttons/PrimaryButton'
import AlreadyLogIn from '../../components/footers/auth/AlreadyLogIn'
import { useDispatch, useSelector } from 'react-redux'
import { signUpPhoneNumberVerify, updateErrorMessage, updateVerificationId } from '../../redux/features/firebase/firebaseSlice'
import { CHANGE_LOADING } from '../../redux/features/loadingSlice'
import AlertModal from '../../components/modals/AlertModal'

const OTPVerificationScreen = ({route}) => {

    const phoneNumber = route.params.phoneNumber
    const [otp, setOtp] = useState('')
    const [isModalVisible, setIsModalVisible] = useState(false)
    const dispatch = useDispatch()
    const vid = useSelector(state => state.firebaseStore.phoneAuth.verificationId)
    const errorMessage = useSelector(state => state.firebaseStore.error.errorBody)
    const [verificationId, setVerificationId] = useState(vid)
    
    const isLoading = useSelector(state => state.loading.value)

    const handleOtp = (newOtp) => {
        if(newOtp.length <= 6 && ( newOtp === '' || /^(0|[1-9][0-9]*)$/.test(newOtp)))
        {
            setOtp(newOtp)
        }
    }

    const handlePress = () => {
        dispatch(CHANGE_LOADING(true))
        try
        {
            dispatch(signUpPhoneNumberVerify({verificationId, otp}))
            .then(() => {
                dispatch(CHANGE_LOADING(false))
            })
        } catch(err) {
            alert(err.message)
        }
    }

    useEffect(() => {
        if(vid)
        {
            dispatch(updateVerificationId(''))
        }
    }, [vid])

    // useEffect(() => {
    //     console.log({otp});
    // }, [otp])

    useEffect(() => {
        if(errorMessage)
        {
            setIsModalVisible(true)
            console.log(errorMessage);
        }
    }, [errorMessage])

    useEffect(() => {
    if(isModalVisible === false)
    {
        dispatch(updateErrorMessage(''))
    }
    }, [isModalVisible])

    return <View style={styles.container}>
        <Text style={styles.textContainer}>Enter the confirmation code that we sent to +91 {phoneNumber}</Text>
        <AlertModal
            title={'Error'}
            message={errorMessage}
            modalVisible={isModalVisible}
            requestClose={() => setIsModalVisible(false)}
        />
        <GeneralField
            placeHolderText={'123456'}
            keyboardType={'numeric'}
            value={otp}
            onInputChange={newOtp => handleOtp(newOtp)}
        />
        <PrimaryButton
            text={'Verify'}
            allowed={otp.length}
            handlePress={handlePress}
            useIndicator={isLoading}
        />
        <AlreadyLogIn />
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: StatusBar.currentHeight,
        backgroundColor: 'black',
        paddingHorizontal: 25
    },
    textContainer: {
        color: 'white',
        textAlign: 'center',
        fontSize: 22,
        marginBottom: 20
    }
})

export default OTPVerificationScreen ;