import { createContext, useState, useEffect } from 'react'
import { useMoralis, useMoralisQuery } from 'react-moralis'
import { amazonAbi, amazonCoinAddress } from '../lib/constants'
import { ethers } from 'ethers' 

export const AmazonContext = createContext()

export const AmazonProvider = ({children}) => {
    const [username, setUsername] = useState('')
    const [nickname, setNickname] = useState('')
    const [assets, setAssets] = useState([])
    const [currentAccount, setCurrentAccount] = useState('')
    const [tokenAmount, setTokenAmount] = useState('')
    const [amountDue, setAmountDue] = useState('')
    const [etherscanLink, setEtherscanLink] = useState('')
    const [isLoaded, setIsLoading] = useState(false)
    const [balance, setBalance] = useState('')

    const {
        authenticate,
        isAuthenticated,
        enableWeb3,
        Moralis,
        user,
        isWeb3Enabled,
    } = useMoralis() 

    const {
        data: assetsData,
        error: assetsDataError,
        isLoading: userDataisLoading,
    } = useMoralisQuery('assets')

    useEffect(() => {
        ;(async() => {
            if (isAuthenticated) {
                const currentUsername = await user?.get('nickname')
                setUsername(currentUsername)
            }
        })()
    }, [isAuthenticated, user, username])

    useEffect(() => {
        ;(async() => {
            if(isWeb3Enabled) {
                await getAssets()
            }
        })()
    }, [isWeb3Enabled, assetsData, userDataisLoading])

    const handleSetUsername = () => {
        if (user) {
            if (nickname) {
                user.set('nickname', nickname)
                user.save()
                setNickname('')
            } else {
                console.log('Please enter a nickname')
            }
        } else {
            console.log('No user') 
        }
    } 
    
    const getAssets = async () => {
        try {
          await enableWeb3()
          setAssets(assetsData)  
        }catch(error){
            console.log(error)
        }
    }

        return (
            <AmazonContext.Provider
            value={{
                isAuthenticated,
                nickname,
                setNickname,
                username,
                setUsername,
                handleSetUsername,
                assets
            }}
            >
                {children}
            </AmazonContext.Provider>
    )
}