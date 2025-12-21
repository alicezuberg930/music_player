import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Search, X } from '@yukikaze/ui/icons'
import { useLocales } from '@/lib/locales'
import { useSelector } from '@/redux/store'

const SearchBar = () => {
    const { translate } = useLocales()
    const navigate = useNavigate()
    const [keyword, setKeyword] = useState<string>('')
    const { scrollTop } = useSelector(state => state.app)

    const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.code === 'Enter' && e.currentTarget.value.length > 2) {
            navigate({
                pathname: 'search/all',
                search: '?q=' + e.currentTarget.value
            })
        }
    }

    return (
        <div className='max-w-[440px] w-full'>
            <div className={`${scrollTop ? 'bg-[#ffffff64]' : 'bg-main-500/30'} text-white rounded-3xl py-2`}>
                <div className='flex w-full'>
                    <Search className='ml-4' />
                    <input
                        type='text' className='outline-none px-2 flex-1 bg-transparent'
                        placeholder={translate('search_placeholder')} name='search'
                        onKeyUp={(e) => handleSubmit(e)}
                        onChange={(e) => { setKeyword(e.target.value) }} value={keyword}
                    />
                    <X onClick={() => setKeyword('')} className={`${keyword ? 'block' : 'hidden'} mr-4`} />
                </div>
            </div>
        </div>
    )
}

export default SearchBar