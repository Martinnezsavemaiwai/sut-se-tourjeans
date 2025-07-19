package test

import (
	"regexp"

	"github.com/asaskevich/govalidator"
)

func InitCustomValidators() {
	// Validator สำหรับ int > 0
	govalidator.CustomTypeTagMap.Set("greaterzeroI", govalidator.CustomTypeValidator(func(i interface{}, context interface{}) bool {
		num, ok := i.(int)
		if !ok {
			return false
		}
		return num > 0
	}))

	// Validator สำหรับ float32 > 0
	govalidator.CustomTypeTagMap.Set("greaterzeroF", govalidator.CustomTypeValidator(func(i interface{}, context interface{}) bool {
		num, ok := i.(float32)
		if !ok {
			return false
		}
		return num > 0
	}))

	// Validator สำหรับ FilePath format
	govalidator.CustomTypeTagMap.Set("filePathFormat", govalidator.CustomTypeValidator(func(value interface{}, context interface{}) bool {
        str, ok := value.(string)
        if !ok {
            return false
        }
        matched, _ := regexp.MatchString(`^images/slips/customer[0-9]+/slip_payment[0-9]+\.(jpg|png|pdf)$`, str)
        return matched
    }))
}