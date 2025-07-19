package controllers

import (
	"fmt"
	"net/http"
	"net/smtp"

	"github.com/gin-gonic/gin"
)

type EmailData struct {
	ID		uint
	Email	string
	Name	string
	TourName	string
	Date	string
	Subject	string
	Body	string
}

// POST /send-email
func SendEmail(c *gin.Context) {
	var emailData EmailData

	if err := c.ShouldBindJSON(&emailData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	email := emailData.Email
	id := emailData.ID
	name := emailData.Name
	tourName := emailData.TourName
	date := emailData.Date
	subject := emailData.Subject
	body := emailData.Body

	auth := smtp.PlainAuth(
		"",
		"toursystem67@gmail.com",
		"vnllxhikcmbquywb",
		"smtp.gmail.com",
	)

	msg := fmt.Sprintf("Subject: %s\nเรียนคุณ %s\n%s\n\nหมายเลขการจอง: %d\nชื่อทัวร์: %s\nวันที่เดินทาง: %s", subject, name, body, id, tourName, date)
	err := smtp.SendMail(
		"smtp.gmail.com:587",
		auth,
		email,
		[]string{email},
		[]byte(msg),
	)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Send Success"})
}